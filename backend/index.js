const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./routes/authRoutes');
const tareaRoutes = require('./routes/tareaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareaRoutes);

// Ruta de prueba
app.get('/', (req, res) => res.send('¡Backend funcionando!'));

// --- ENCENDER EL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});