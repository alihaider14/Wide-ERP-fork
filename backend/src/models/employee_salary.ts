import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema(
	{
		employee_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "employees",
			required: true,
			index: true,
		},
		base_salary: {
			type: Number,
			required: true,
		},
		commission: {
			type: Number,
			default: 0,
		},
		other: {
			type: Number,
			default: 0,
		},
		payment_month: {
			type: String,
			required: true,
		},
		paid_at: {
			type: Date,
			required: true,
		},
		note: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

employeeSalarySchema.index({ employee_id: 1, paid_at: -1, createdAt: -1 });

const EmployeeSalary =
	mongoose.models?.employee_salaries ||
	mongoose.model("employee_salaries", employeeSalarySchema);

export default EmployeeSalary;
