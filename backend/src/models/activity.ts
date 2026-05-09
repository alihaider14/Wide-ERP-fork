import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		module_id: {
			type: String,
			required: true,
		},
		activity: {
			type: String,
			required: true,
		},
		activist_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ module_id: 1 });
activitySchema.index({ activist_id: 1 });

const Activity = mongoose.models?.activities || mongoose.model("activities", activitySchema);

export default Activity;
