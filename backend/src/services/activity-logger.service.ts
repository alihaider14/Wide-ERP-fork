import Activity from "../models/activity";
import { IActivityLog, IGetActivitiesParams } from "~/types/activity";
import { formatDateTimeToLocaleString } from "~/helper/time-formator";

export const logActivity = async ({
    type,
    moduleID,
    activity,
    activistId,
}: IActivityLog): Promise<void> => {
    try {
        await Activity.create({
            type,
            module_id: moduleID,
            activity,
            activist_id: activistId,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

export const getActivitiesByType = async (type: string, limit: number = 50) => {
    try {
        return await Activity.find({ type })
            .populate("activist_id", "full_name email")
            .sort({ createdAt: -1 })
            .limit(limit);
    } catch (error) {
        throw error;
    }
};

export const getActivitiesByModule = async (moduleId: string, limit: number = 50) => {
    try {
        return await Activity.find({ module_id: moduleId })
            .populate("activist_id", "full_name email")
            .sort({ createdAt: -1 })
            .limit(limit);
    } catch (error) {
        throw error;
    }
};

export const getAllActivities = async ({
    page = 1,
    size = 50,
    from,
    to,
}: IGetActivitiesParams = {}) => {
    try {
        const skip = (page - 1) * size;

        const dateFilter: {
            createdAt?: {
                $gte?: Date;
                $lte?: Date;
            };
        } = {};
        if (from || to) {
            dateFilter.createdAt = {};
            if (from) {
                const fromDate = new Date(from);
                fromDate.setHours(0, 0, 0, 0);
                dateFilter.createdAt.$gte = fromDate;
            }
            if (to) {
                const toDate = new Date(to);
                toDate.setHours(23, 59, 59, 999);
                dateFilter.createdAt.$lte = toDate;
            }
        }

        const [activities, total] = await Promise.all([
            Activity.find(dateFilter)
                .populate("activist_id", "full_name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(size),
            Activity.countDocuments(dateFilter),
        ]);

        const formattedActivities = activities.map((activity) => ({
            _id: activity._id,
            date_time: formatDateTimeToLocaleString(new Date(activity.createdAt)),
            activites: activity.activity,
            module_id: activity.module_id,
            activist_id: activity.activist_id,
            created_at: activity.createdAt,
            updated_at: activity.updatedAt,
        }));

        return {
            data: formattedActivities,
            total,
            page,
            total_pages: Math.ceil(total / size),
        };
    } catch (error) {
        throw error;
    }
};
