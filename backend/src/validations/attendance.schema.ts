import { z } from "zod";

export const manualAttendanceSchema = z
  .object({
    employee_id: z.string().min(1, "Employee ID is required"),
    mark: z.enum(["check_in", "check_out", "absent", "leave"]),
    attendance_date_time: z.string().min(1, "Date and time is required"),
    note: z.string().optional(),
  })
  .refine(
    (data) =>
      data.mark === "leave" || new Date(data.attendance_date_time) <= new Date(),
    {
      message: "Future date/time is not allowed",
      path: ["attendance_date_time"],
    },
  );

export const getAttendanceSchema = z.object({
  pageNo: z.string().transform(Number),
  size: z.string().transform(Number),
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});