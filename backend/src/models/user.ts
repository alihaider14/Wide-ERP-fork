import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		full_name: {
			type: String,
			required: true,
		},
		user_id: {
			type: Number,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		access: {
			type: [String],
			required: true,
		},
		forgotPasswordToken: {
			type: String,
			default: null
		  },
		  forgotPasswordTokenExpiry: {
			type: Date,
			default: null
		  },
	},
	{
		timestamps: true,
	},
);

const User = mongoose.models?.users || mongoose.model("users", userSchema);

export default User;
