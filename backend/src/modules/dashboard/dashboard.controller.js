import { getDashboardStats } from "./dashboard.service.js";
import { success } from "../../utils/response.js";

export const getDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};
