import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import FormularioTarea from "./components/FormularioTarea";
import Login from "./components/Login";

function App() {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const [autenticado, setAutenticado] = useState(false); // Estado de sesión

  // 1. Revisamos si hay token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAutenticado(true);
    }
  }, []);

  // 2. Si está autenticado, cargamos las tareas
  useEffect(() => {
    if (autenticado) {
      cargarTareas();
    }
  }, [autenticado]);

  const cargarTareas = async () => {
    const token = localStorage.getItem("token"); // Recuperamos el token
    try {
      const response = await fetch("http://localhost:3000/api/tareas", {
        headers: {
          Authorization: `Bearer ${token}`, // Lo enviamos al backend
        },
      });
      if (!response.ok)
        throw new Error("Error al cargar las tareas. Inicia sesión de nuevo.");
      const data = await response.json();
      setTareas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const crearTarea = async (titulo, descripcion) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // El token es obligatorio
        },
        body: JSON.stringify({ titulo, descripcion }),
      });
      if (!response.ok) throw new Error("Error al crear la tarea");
      cargarTareas();
    } catch (err) {
      setError(err.message);
    }
  };

  const borrarTarea = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tareas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) cargarTareas();
    } catch (err) {
      setError("Error al borrar la tarea");
    }
  };

  const alternarEstado = async (id, estadoActual) => {
    const token = localStorage.getItem("token");
    const nuevoEstado =
      estadoActual === "pendiente" ? "completado" : "pendiente";
    try {
      const response = await fetch(`http://localhost:3000/api/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (response.ok) cargarTareas();
    } catch (err) {
      setError("Error al actualizar la tarea");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token"); // Borramos el token
    setAutenticado(false); // Volvemos al Login
    setTareas([]); // Limpiamos las tareas
  };

  // Cálculos para el gráfico
  const tareasCompletadas = tareas.filter(
    (t) => t.estado === "completado",
  ).length;
  const tareasPendientes = tareas.filter(
    (t) => t.estado === "pendiente",
  ).length;
  const dataGrafico = [
    { name: "Completadas", value: tareasCompletadas },
    { name: "Pendientes", value: tareasPendientes },
  ];

  // --- RENDERIZADO CONDICIONAL ---
  // Si no está autenticado, solo mostramos el Login
  if (!autenticado) {
    return <Login onLoginExitoso={() => setAutenticado(true)} />;
  }

  // Si está autenticado, mostramos el Task Manager
  return (
    <div className="container">
      <div className="header-tareas">
        <h1>Task Manager</h1>
        <button onClick={cerrarSesion} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
      <p className="subtitle">Fullstack: React + Node.js + PostgreSQL</p>

      {error && <div className="error">{error}</div>}

      <Dashboard
        tareasCompletadas={tareasCompletadas}
        tareasPendientes={tareasPendientes}
        dataGrafico={dataGrafico}
      />

      <FormularioTarea onCrearTarea={crearTarea} />

      <ul className="lista-tareas">
        {tareas.map((tarea) => (
          <li key={tarea.id} className={tarea.estado}>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  textDecoration:
                    tarea.estado === "completado" ? "line-through" : "none",
                }}
              >
                {tarea.titulo}
              </h3>
              <p>{tarea.descripcion}</p>
            </div>
            <div className="acciones">
              <button
                className="btn-estado"
                onClick={() => alternarEstado(tarea.id, tarea.estado)}
              >
                {tarea.estado === "pendiente" ? "Completar" : "Reabrir"}
              </button>
              <button
                className="btn-borrar"
                onClick={() => borrarTarea(tarea.id)}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
