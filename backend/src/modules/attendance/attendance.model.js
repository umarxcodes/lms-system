import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "late"], required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
