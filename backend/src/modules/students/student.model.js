import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rollNumber: { type: String, required: true, unique: true },
  batch: { type: String },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
