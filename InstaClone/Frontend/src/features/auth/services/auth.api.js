import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}


export async function login(username, password) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/getMe");
    return response.data;
  } catch (error) {
    console.error("Get me failed:", error);
    throw error;
  }
}
