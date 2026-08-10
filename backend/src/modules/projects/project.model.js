import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  deadline: { type: Date }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
