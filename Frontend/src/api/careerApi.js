import api from "./axios";

export const getAllCareers = async () => {
  const res = await api.get("/careers");
  return res.data;
};

export const getCareerById = async (id) => {
  const res = await api.get(`/careers/${id}`);
  return res.data;
};

export const createLearningPath = async (careerId) => {
  const res = await api.post("/learningpaths", { careerId });
  return res.data;
};
