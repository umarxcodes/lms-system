import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  // A team owns one project. This is also enforced in the service for a clear API error.
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, unique: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  deadline: { type: Date }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
