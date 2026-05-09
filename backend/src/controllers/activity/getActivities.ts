import { Request, Response } from "express";
import { getAllActivities } from "~/services/activity-logger.service";

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 50;
        const from = req.query.from as string;
        const to = req.query.to as string;

        const result = await getAllActivities({
            page,
            size,
            from,
            to,
        });

        res.status(200).json(result);
    } catch (error) {
        res
            .status(error instanceof Error ? 400 : 500)
            .json({ error: error instanceof Error ? error.message : error });
    }
};
