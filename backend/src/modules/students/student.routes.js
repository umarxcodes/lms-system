import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { createStudentController, getAllStudentsController, getStudentByIdController, updateStudentController, deleteStudentController } from "./student.controller.js";

const router = express.Router();

router.post("/", authenticate, createStudentController);
router.get("/", authenticate, getAllStudentsController);
router.get("/:id", authenticate, getStudentByIdController);
router.put("/:id", authenticate, updateStudentController);
router.delete("/:id", authenticate, deleteStudentController);

export default router;
