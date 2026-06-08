// Importa Axios, librería utilizada para realizar peticiones HTTP
// desde el frontend React hacia el backend Express.
import axios from "axios";

// Se crea una instancia centralizada de axios
// Así se permite reutilizar la misma configuración de API en todo el proyecto
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api"
});

// Interceptor que revisa todas las respuestas del servidor
// antes de que lleguen al componente que realizó la petición
api.interceptors.response.use(

  // Si la respuesta es exitosa, se deja pasar sin modificarla
  (response) => response,

  (error) => {
    // Se verifica si el error provino del endpoint de login,
    // para no redirigir cuando el usuario escribe mal su contraseña
    const esLoginEndpoint = error.config?.url?.includes("/usuarios/login");

    // Se comprueba si existe una sesión activa guardada en el navegador
    const haySession = !!localStorage.getItem("usuario");

    // Si el backend responde 401, no es el login y existe una sesión guardada,
    // se limpia el usuario local y se redirige al login
    if (error.response?.status === 401 && !esLoginEndpoint && haySession) {
      localStorage.removeItem("usuario");
      window.dispatchEvent(new Event("usuarioActualizado")); // avisa al Navbar para que actualice su estado
      window.location.href = "/login";
    }

    // Se mantiene el rechazo del error para que el componente
    // correspondiente pueda mostrar su propio mensaje si lo necesita
    return Promise.reject(error);
  }
);

// Se exporta la instancia configurada para utilizarla en cualquier parte del proyecto
export default api;
