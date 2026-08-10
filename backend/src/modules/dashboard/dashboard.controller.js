import { getDashboardStats } from "./dashboard.service.js";
import { success } from "../../utils/response.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    return success(res, stats);
  } catch (err) {
    err.message = "Unable to load dashboard";
    throw err;
  }
};
