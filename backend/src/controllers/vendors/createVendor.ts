import { Response } from "express";
import { Types } from "mongoose";
import User from "~/models/user";
import Vendor from "~/models/vendor";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { createVendorSchema } from "~/validations/vendor.schema";

export const createVendor = async (
    req: TAuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const validatedData = await validateWithZod(createVendorSchema, req.body);

        const { full_name, email, phone, address = "", opening_balance = 0 } = validatedData;

        const existingVendor = await Vendor.findOne({ phone });

        if (existingVendor) {
            res.status(400).json({ error: "Vendor with this phone number already exists" });
            return;
        }

        const newVendor = new Vendor({
            full_name,
            email: email || null,
            phone,
            address,
            opening_balance,
            to_pay: opening_balance,
        });

        const savedVendor = await newVendor.save();
        const userId = req.user?._id;
        if (userId) {
            const user = await User.findById(userId);
            await logActivity({
                type: "create_vendor",
                moduleID: savedVendor._id as Types.ObjectId,
                activity: `Vendor ${full_name} created with phone ${phone} by ${user?.full_name || 'User'}.`,
                activistId: userId,
            });
        } else {
            console.warn("Activity not logged: User ID not found in request");
        }

        res.status(201).json({
            message: "Vendor created successfully",
            vendor: {
                _id: savedVendor._id,
                full_name: savedVendor.full_name,
                email: savedVendor.email,
                phone: savedVendor.phone,
                address: savedVendor.address,
                to_pay: savedVendor.to_pay,
            },
        });
    } catch (error: unknown) {
        if (
            error &&
            typeof error === "object" &&
            "validation" in error
        ) {
            res.status(400).json({
                error: 'Validation failed',
                details: (error as {validation?: unknown}).validation
            });
        } else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: errorMessage });
        }
    }
};
