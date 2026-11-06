import { useState } from 'react';

export default function FormularioTarea({ onCrearTarea }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo) return;
    onCrearTarea(titulo, descripcion);
    setTitulo('');
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <input 
        type="text" 
        placeholder="Título de la tarea" 
        value={titulo} 
        onChange={(e) => setTitulo(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Descripción (opcional)" 
        value={descripcion} 
        onChange={(e) => setDescripcion(e.target.value)} 
      />
      <button type="submit">Añadir Tarea</button>
    </form>
  );
}