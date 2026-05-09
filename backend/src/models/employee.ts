import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
	{
		full_name: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		base_salary: {
			type: Number,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		cnic: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		joined_at: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["Onboard", "Active", "On hold", "Terminated"],
			required: true,
		},
		last_paid: {
			type: Date,
		},
		last_payment_amount: {
			type: Number,
		},
		working_hours: [
			{
				day: {
					type: String,
					enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					required: true,
				},
				is_working_day: {
					type: Boolean,
					required: true,
				},
				start_time: {
					type: String,
					default: null,
				},
				end_time: {
					type: String,
					default: null,
				},
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

employeeSchema.virtual("experience").get(function () {
	const joinedAt = new Date(this.joined_at);
	const now = new Date();

	if (joinedAt > now) return "0d";

	let years = now.getFullYear() - joinedAt.getFullYear();
	let months = now.getMonth() - joinedAt.getMonth();
	let days = now.getDate() - joinedAt.getDate();

	if (days < 0) {
		months--;
		const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		days += prevMonth.getDate();
	}

	if (months < 0) {
		years--;
		months += 12;
	}

	const parts = [];
	if (years > 0) parts.push(`${years}y`);
	if (months > 0) parts.push(`${months}m`);
	if (days > 0 || parts.length === 0) parts.push(`${days}d`);

	return parts.join(" ");
});

const Employee =
	mongoose.models?.employees || mongoose.model("employees", employeeSchema);

export default Employee;
