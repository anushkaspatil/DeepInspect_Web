const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const registerUser = (data) =>
  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const fetchUsers = () =>
  fetch(`${API_BASE}/users`).then((res) => res.json());
