import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { createTeamController, getAllTeamsController, getTeamByIdController, addMemberController, removeMemberController, updateTeamController, deleteTeamController } from "./team.controller.js";
import { createTeamSchema, updateTeamSchema, memberSchema } from "./team.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.body = result.data;
  return next();
};

const router = express.Router();

router.post("/", authenticate, requireRole(ROLES.ADMIN), validate(createTeamSchema), createTeamController);
router.get("/", authenticate, requireRole(ROLES.ADMIN), getAllTeamsController);
router.get("/:id", authenticate, requireRole(ROLES.ADMIN), getTeamByIdController);
router.post("/:id/members", authenticate, requireRole(ROLES.ADMIN), validate(memberSchema), addMemberController);
router.delete("/:id/members/:memberId", authenticate, requireRole(ROLES.ADMIN), removeMemberController);
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateTeamSchema), updateTeamController);
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), deleteTeamController);

export default router;
