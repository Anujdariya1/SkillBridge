import api from "./axios";

export const getLearningPath = async (pathId) => {
  const res = await api.get(`/learningpaths/${pathId}`);
  return res.data;
};

export const getUserLearningPaths = async () => {
  const res = await api.get("/learningpaths/user");
  return res.data;
};
