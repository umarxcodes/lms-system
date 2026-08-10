import Student from "./student.model.js";

export const createStudent = async (data) => {
  const student = await Student.create(data);
  return student.populate("user", "name email");
};

export const getAllStudents = async () => {
  return await Student.find().populate("user", "name email");
};

export const getStudentById = async (id) => {
  return await Student.findById(id).populate("user", "name email");
};

export const updateStudent = async (id, data) => {
  return await Student.findByIdAndUpdate(id, data, { new: true }).populate("user", "name email");
};

export const deleteStudent = async (id) => {
  return await Student.findByIdAndDelete(id);
};
