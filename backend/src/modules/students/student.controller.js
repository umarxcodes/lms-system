import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from "./student.service.js";
import { success, error } from "../../utils/response.js";

export const createStudentController = async (req, res, next) => {
  try {
    const student = await createStudent(req.body);
    success(res, student, "Student created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllStudentsController = async (req, res, next) => {
  try {
    const students = await getAllStudents();
    success(res, students);
  } catch (err) {
    next(err);
  }
};

export const getStudentByIdController = async (req, res, next) => {
  try {
    const student = await getStudentById(req.params.id);
    if (!student) return error(res, "Student not found", 404);
    success(res, student);
  } catch (err) {
    next(err);
  }
};

export const updateStudentController = async (req, res, next) => {
  try {
    const student = await updateStudent(req.params.id, req.body);
    success(res, student, "Student updated");
  } catch (err) {
    next(err);
  }
};

export const deleteStudentController = async (req, res, next) => {
  try {
    await deleteStudent(req.params.id);
    success(res, null, "Student deleted");
  } catch (err) {
    next(err);
  }
};
