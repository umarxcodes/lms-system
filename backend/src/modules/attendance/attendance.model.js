import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "leave", "late"], required: true },
  notes: { type: String }
}, { timestamps: true });

attendanceSchema.index({ student: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
