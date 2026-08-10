import { getDashboardStats } from "./dashboard.service.js";
import { success } from "../../utils/response.js";

export const getDashboardStatsController = async (req, res) => {
  const stats = await getDashboardStats();
  success(res, stats);
};
