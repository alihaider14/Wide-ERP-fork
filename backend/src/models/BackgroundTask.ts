import mongoose from "mongoose";

const BackgroundTaskSchema = new mongoose.Schema(
  {
    task_no: {type: Number, required: true, unique: true},
    type: {type: String, required: true},
    note: {type: String},
    status: {
      type: String,
      enum: ["Active", "Paused", "Completed", "Error"],
      default: "Active",
      index: true,
    },
    attempts: {type: Number, default: 0},
    max_attempts: {type: Number, default: 3},
    last_run_at: {type: Date, default: Date.now},
    collection_name: {type: String},
    doc_id: {type: mongoose.Schema.Types.ObjectId, refPath: "collection_name"},
  },
  {timestamps: true},
);

export const BackgroundTask = mongoose.model(
  "BackgroundTask",
  BackgroundTaskSchema,
);
