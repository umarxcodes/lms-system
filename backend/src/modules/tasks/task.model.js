import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: { type: Date }
}, { timestamps: true });

taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
