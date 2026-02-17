import api from "./axios";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // store token
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
