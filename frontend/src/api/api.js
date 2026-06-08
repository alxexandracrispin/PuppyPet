import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api"
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLoginEndpoint = error.config?.url?.includes("/usuarios/login");
    const haySession = !!localStorage.getItem("usuario");

    if (error.response?.status === 401 && !esLoginEndpoint && haySession) {
      localStorage.removeItem("usuario");
      window.dispatchEvent(new Event("usuarioActualizado"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;