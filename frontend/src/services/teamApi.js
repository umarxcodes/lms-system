import { apiClient } from "./api.client";

export const teamApi = {
  createTeam: (data) => apiClient.post("/teams", data),
  getTeams: (params) => apiClient.get("/teams", { params }),
  getMyTeam: () => apiClient.get("/teams/me"),
  getTeamById: (id) => apiClient.get(`/teams/${id}`),
  addMember: (teamId, studentId) => apiClient.post(`/teams/${teamId}/members`, { studentId }),
  removeMember: (teamId, memberId) => apiClient.delete(`/teams/${teamId}/members/${memberId}`),
  getTeamMembers: (teamId) => apiClient.get(`/teams/${teamId}/members`),
  updateTeam: (id, data) => apiClient.patch(`/teams/${id}`, data),
  deleteTeam: (id) => apiClient.delete(`/teams/${id}`),
};
