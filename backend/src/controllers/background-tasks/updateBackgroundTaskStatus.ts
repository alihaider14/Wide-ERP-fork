import {Request, Response} from "express";
import {BackgroundTask} from "~/models/BackgroundTask";
import {validateWithZod} from "~/utils/errorHandling";
import { updateTaskStatusSchema } from "~/validations/backgroundTask.schema";

export const updateBackgroundTaskStatus = async (req: Request, res: Response) => {
  try {
    const validatedData = await validateWithZod(updateTaskStatusSchema, req.body);

    const {id} = req.params;
    const {status} = validatedData;

    const task = await BackgroundTask.findByIdAndUpdate(
      id,
      {status},
      {new: true},
    );

    if (!task) {
      res.status(404).json({message: "Task not found"});
      return;
    }

    res.status(200).json({task});
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "validation" in error
    ) {
      res.status(400).json({error: (error as {validation?: unknown}).validation});
      return;
    }
    res.status(500).json({message: "Failed to update task status"});
  }
};