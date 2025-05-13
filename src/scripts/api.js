/**
 * Handles API requests for authentication.
 */
const API_URL = "http://localhost:3000/api/auth";

const checkResponse = async (res) => {
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }
  return res.json();
};

export const registerUser = async ({ email, password, phone, inn, role }) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, phone, inn, role }),
  });
  return checkResponse(res);
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
};
