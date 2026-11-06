const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const verificarToken = require('../middlewares/auth');

// Aplicamos el middleware a todas las rutas de este archivo
router.use(verificarToken);

router.get('/', tareaController.obtenerTareas);
router.post('/', tareaController.crearTarea);
router.put('/:id', tareaController.actualizarTarea);
router.delete('/:id', tareaController.borrarTarea);

module.exports = router;