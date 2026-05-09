import {Request, Response} from "express";
import {validateWithZod} from "~/utils/errorHandling";
import {getAttendanceSchema} from "~/validations/attendance.schema";
import Attendance from "~/models/attendance";
import Employee from "~/models/employee";
import mongoose from "mongoose";
import { PipelineStage } from "mongoose";

export const getAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validated = await validateWithZod(getAttendanceSchema, req.query);

    const {pageNo, size, q, from, to} = validated;

    let employeeIds: mongoose.Types.ObjectId[] | null = null;
    if (q) {
      const employees = await Employee.find({
        full_name: {$regex: q, $options: "i"},
      }).select("_id");
      employeeIds = employees.map((e) => e._id as mongoose.Types.ObjectId);
    }

    const dateFilter: { $gte?: string; $lte?: string } = {};
    if (from) dateFilter.$gte = new Date(from).toISOString().split("T")[0];
    if (to) dateFilter.$lte = new Date(to).toISOString().split("T")[0];

    const matchStage: {
      date?: { $gte?: string; $lte?: string };
      employee_id?: { $in: mongoose.Types.ObjectId[] };
    } = {};
    if (Object.keys(dateFilter).length) matchStage.date = dateFilter;
    if (employeeIds) matchStage.employee_id = {$in: employeeIds};

    const skip = (pageNo - 1) * size;

    const pipeline: PipelineStage[] = [
      {$match: matchStage},
      {
        $group: {
          _id: {employee_id: "$employee_id", date: "$date"},
          check_in: {
            $max: {
              $cond: [
                {$eq: ["$type", "check_in"]},
                "$attendance_date_time",
                null,
              ],
            },
          },
          check_out: {
            $max: {
              $cond: [
                {$eq: ["$type", "check_out"]},
                "$attendance_date_time",
                null,
              ],
            },
          },
          marked_leave_by: {
            $max: {
              $cond: [{$eq: ["$type", "leave"]}, "$marked_leave_by", null],
            },
          },
          is_absent: {
            $max: {
              $cond: [{$eq: ["$type", "absent"]}, true, false],
            },
          },
        },
      },

      {
        $lookup: {
          from: "employees",
          localField: "_id.employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {$unwind: "$employee"},

      {
        $lookup: {
          from: "users",
          let: {leaveById: "$marked_leave_by"},
          pipeline: [
            {
              $match: {
                $expr: {$eq: ["$_id", "$$leaveById"]},
              },
            },
            {
              $project: {full_name: 1},
            },
          ],
          as: "leave_marked_by_employee",
        },
      },

      {
        $project: {
          _id: {$concat: [{$toString: "$_id.employee_id"}, "_", "$_id.date"]},
          employee_id: "$_id.employee_id",
          name: "$employee.full_name",
          date: "$_id.date",
          check_in: 1,
          check_out: 1,
          is_absent: 1,
          marked_leave_by: {
            $cond: [
              {$gt: [{$size: "$leave_marked_by_employee"}, 0]},
              {$arrayElemAt: ["$leave_marked_by_employee.full_name", 0]},
              null,
            ],
          },
        },
      },

      {$sort: {date: -1, name: 1}},
    ];

    const countPipeline: PipelineStage[] = [...pipeline, {$count: "total"}];
    const paginatedPipeline: PipelineStage[] = [
      ...pipeline,
      {$skip: skip},
      {$limit: size},
    ];

    const [countResult, records] = await Promise.all([
      Attendance.aggregate(countPipeline),
      Attendance.aggregate(paginatedPipeline),
    ]);

    const total_rows = countResult[0]?.total ?? 0;
    const total_pages = Math.ceil(total_rows / size);
    const to_row = size * pageNo;
    const from_row = to_row - (size - 1);

    res.status(200).json({
      attendance: records,
      total_rows,
      total_pages,
      from: total_rows === 0 ? 0 : from_row,
      to: to_row > total_rows ? total_rows : to_row,
    });
  } catch (error) {
    res.status(400).json({error});
  }
};