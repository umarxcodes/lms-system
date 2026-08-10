import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { createTeamController, getAllTeamsController, getTeamByIdController, addMemberController, removeMemberController } from "./team.controller.js";
import { createTeamSchema } from "./team.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  req.body = result.data;
  next();
};

const router = express.Router();

router.post("/", authenticate, validate(createTeamSchema), createTeamController);
router.get("/", authenticate, getAllTeamsController);
router.get("/:id", authenticate, getTeamByIdController);
router.post("/:id/members", authenticate, addMemberController);
router.delete("/:id/members/:memberId", authenticate, removeMemberController);

export default router;
