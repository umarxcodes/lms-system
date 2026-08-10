import { createStudent, getAllStudents, getStudentById, getAuthenticatedStudent, updateStudent, deleteStudent } from "./student.service.js";
import { success, error } from "../../utils/response.js";
import { ROLES } from "../auth/auth.model.js";

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
    if (req.user.role === ROLES.STUDENT && student.user._id.toString() !== req.user.userId) {
      return error(res, "Access denied", 403);
    }
    return success(res, student);
  } catch (err) {
    next(err);
  }
};

export const getMyStudentProfileController = async (req, res, next) => {
  try {
    const student = await getAuthenticatedStudent(req.user.userId);
    if (!student) return error(res, "Student profile not found", 404);
    return success(res, student);
  } catch (err) {
    next(err);
  }
};

export const updateStudentController = async (req, res, next) => {
  try {
    const student = await updateStudent(req.params.id, req.body);
    if (!student) return error(res, "Student not found", 404);
    return success(res, student, "Student updated");
  } catch (err) {
    next(err);
  }
};

export const deleteStudentController = async (req, res, next) => {
  try {
    await deleteStudent(req.params.id);
    return success(res, null, "Student deleted");
  } catch (err) {
    next(err);
  }
};
