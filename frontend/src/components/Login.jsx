import { useState } from 'react';

export default function Login({ onLoginExitoso }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [esRegistro, setEsRegistro] = useState(false); // Para alternar entre Login y Registro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Elegimos la URL dependiendo de si es login o registro
    const url = esRegistro 
      ? 'http://localhost:3000/api/auth/register' 
      : 'http://localhost:3000/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      if (esRegistro) {
        // Si se registró bien, cambiamos a la vista de Login
        alert('Usuario registrado con éxito. Ahora inicia sesión.');
        setEsRegistro(false);
        setPassword('');
      } else {
        // Si es login, guardamos el token y avisamos al padre
        localStorage.setItem('token', data.token);
        onLoginExitoso();
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-primary">
          {esRegistro ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <p className="toggle-auth" onClick={() => setEsRegistro(!esRegistro)}>
        {esRegistro 
          ? '¿Ya tienes cuenta? Inicia sesión' 
          : '¿No tienes cuenta? Regístrate aquí'}
      </p>
    </div>
  );
}