const pool = require('../config/db');

exports.obtenerTareas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

exports.crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

        const result = await pool.query(
            'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',
            [titulo, descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

exports.actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; 
        const result = await pool.query('UPDATE tareas SET estado = $1 WHERE id = $2 RETURNING *', [estado, id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

exports.borrarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar la tarea' });
    }
};