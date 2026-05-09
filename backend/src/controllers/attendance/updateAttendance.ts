import { Response } from "express";
import mongoose from "mongoose";
import { validateWithZod } from "~/utils/errorHandling";
import Attendance from "~/models/attendance";
import { TAuthenticatedRequest } from "~/types/express";
import { manualAttendanceSchema } from "~/validations/attendance.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";

export const updateAttendance = async (req: TAuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validated = await validateWithZod(manualAttendanceSchema, req.body);

    const { employee_id, mark, attendance_date_time, note } = validated;
    const attendanceDate = new Date(attendance_date_time);
    const date = attendanceDate.toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];

    if (["check_in", "check_out", "absent"].includes(mark) && date > todayDate) {
      res.status(400).json({ message: `${mark.replace("_", "-")} cannot be marked for a future date.` });
      return;
    }

    if (mark === "check_out") {
      const checkInRecord = await Attendance.findOne({ employee_id, date, type: "check_in" });

      if (!checkInRecord?.attendance_date_time) {
        res.status(400).json({ message: ERROR_MESSAGES.attendanceCheckInMissing });
        return;
      }

      const checkInTime = new Date(checkInRecord.attendance_date_time).getTime();
      if (attendanceDate.getTime() <= checkInTime) {
        res.status(400).json({ message: ERROR_MESSAGES.attendanceCheckOutBeforeCheckIn });
        return;
      }
    }

    let record = await Attendance.findOne({ employee_id, date, type: mark });

    if (record) {
      record.attendance_date_time = attendanceDate;
      record.note = note ?? "";
      if (mark === "leave" && req.user?._id) {
        record.marked_leave_by = new mongoose.Types.ObjectId(req.user._id);
      }
      await record.save();
    } else {
      record = await Attendance.create({
        employee_id,
        type: mark,
        attendance_date_time: attendanceDate,
        date,
        note: note ?? "",
        ...(mark === "leave" && req.user?._id && { marked_leave_by: new mongoose.Types.ObjectId(req.user._id) }),
      });
    }

    res.status(200).json({ message: "Attendance updated successfully", record });

  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: number }).status === 400 &&
      "validation" in error
    ) {
      const validationError = error as {
        message?: string;
        validation?: Record<string, unknown>;
      };
      res.status(400).json({
        message: validationError.message || "Validation failed",
        errors: validationError.validation,
      });
      return;
    }

    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
