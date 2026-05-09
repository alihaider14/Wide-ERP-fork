import { Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import Attendance from "~/models/attendance";
import { TAuthenticatedRequest } from "~/types/express";
import { manualAttendanceSchema } from "~/validations/attendance.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";

export const manualAttendance = async (req: TAuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = await validateWithZod(manualAttendanceSchema, req.body);

    const { employee_id, mark, attendance_date_time, note } = validatedData;

    const employeeExists = await Employee.findOne({ employee_id });
    if (!employeeExists) {
      res.status(400).json({ message: "Employee not found with the provided ID." });
      return;
    }

    const attendanceDate = new Date(attendance_date_time);
    const date = attendanceDate.toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];

    // Rule: Check-in, check-out, and absent cannot be marked for a future date
    if (["check_in", "check_out", "absent"].includes(mark) && date > todayDate) {
      res.status(400).json({ message: `${mark.replace("_", "-")} cannot be marked for a future date.` });
      return;
    }

    if (mark === "check_in") {
      const existingCheckIn = await Attendance.findOne({
        employee_id,
        date,
        type: "check_in",
      });

      if (existingCheckIn) {
        res.status(409).json({ message: ERROR_MESSAGES.attendanceAlreadyCheckedIn });
        return;
      }

      await Attendance.deleteMany({
        employee_id,
        date,
        type: { $in: ["leave", "absent"] },
      });

    } else if (mark === "check_out") {
      const checkInRecord = await Attendance.findOne({
        employee_id,
        date,
        type: "check_in",
      });

      if (!checkInRecord) {
        res.status(400).json({ message: ERROR_MESSAGES.attendanceCheckInMissing });
        return;
      }

      if (!checkInRecord.attendance_date_time) {
        res.status(400).json({ message: ERROR_MESSAGES.attendanceCheckInTimeMissing });
        return;
      }

      const checkInTime = new Date(checkInRecord.attendance_date_time).getTime();
      const checkOutTime = new Date(attendance_date_time).getTime();

      if (checkOutTime <= checkInTime) {
        res.status(400).json({ message: ERROR_MESSAGES.attendanceCheckOutBeforeCheckIn });
        return;
      }

      await Attendance.deleteMany({
        employee_id,
        date,
        type: { $in: ["check_out", "leave", "absent"] },
      });

    } else if (mark === "leave" || mark === "absent") {
      await Attendance.deleteMany({
        employee_id,
        date,
        type: { $in: ["check_in", "check_out", "leave", "absent"] },
      });
    }

    const saved = await Attendance.create({
      employee_id,
      type: mark,
      attendance_date_time: attendanceDate,
      date,
      note: note ?? "",
      ...(mark === "leave" && { marked_leave_by: req.user?._id }),
    });

    res.status(200).json({ message: "Attendance marked successfully", saved });

  } catch (error: unknown) {
    // Handle validation errors thrown by validateWithZod
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

    console.error("Error marking manual attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};