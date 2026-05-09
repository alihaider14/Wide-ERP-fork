import { z } from "zod";
import { ERROR_MESSAGES } from "@/constant/errorMessage";

export const manualAttendanceSchema = z
    .object({
        employee_id: z
            .string({ required_error: ERROR_MESSAGES.employeeRequired })
            .min(1, { message: ERROR_MESSAGES.employeeRequired }),

        mark: z.enum(["check_in", "check_out", "absent", "leave"], {
            message: ERROR_MESSAGES.markRequired,
        }),
        attendance_date_time: z
            .string({ required_error: ERROR_MESSAGES.attendanceDateTimeRequired })
            .min(1, { message: ERROR_MESSAGES.attendanceDateTimeRequired })
            .refine((val) => !isNaN(new Date(val).getTime()), {
                message: ERROR_MESSAGES.attendanceDateTimeInvalid,
            }),

        note: z.string().trim().optional().default(""),
    })
    .refine(
        (data) =>
            data.mark === "leave" || new Date(data.attendance_date_time) <= new Date(),
        {
            message: ERROR_MESSAGES.attendanceDateTimeFuture,
            path: ["attendance_date_time"],
        },
    );