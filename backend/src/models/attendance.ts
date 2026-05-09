import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["check_in", "check_out", "absent", "leave"],
      required: true,
    },
    attendance_date_time: {
      type: Date,
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    marked_leave_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ employee_id: 1, date: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;