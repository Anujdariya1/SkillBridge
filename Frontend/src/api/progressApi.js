import api from "./axios";

export const updateSkillLevel = async (skillId, level) => {
  const res = await api.patch(`/progress/${skillId}/level`, { level });
  return res.data;
};
