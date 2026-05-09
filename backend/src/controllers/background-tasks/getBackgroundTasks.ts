import {Request, Response} from "express";
import {BackgroundTask} from "~/models/BackgroundTask";

export const getBackgroundTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await BackgroundTask.find();

    if (tasks.length === 0) {
      return res.status(404).json({message: "No tasks found"});
    }

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};
