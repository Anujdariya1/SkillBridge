const API_BASE_URL = "http://localhost:5000";

export const getHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.json();
};
