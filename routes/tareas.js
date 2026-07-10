const express = require('express');
const { body, param, validationResult } = require('express-validator');

const tareasModel = require('../models/tareas');
const climaService = require('../services/climaService');

const router = express.Router();

function validar(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array()
    });
  }

  next();
}

const validarId = param('id')
  .isInt()
  .withMessage('El id debe ser un número entero');

const validarCiudad = param('ciudad')
  .trim()
  .notEmpty()
  .withMessage('La ciudad no debe estar vacía')
  .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/)
  .withMessage('La ciudad solo puede contener letras, espacios o guiones');

// GET /api/tareas
router.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'Lista de tareas obtenida correctamente',
    tareas: tareasModel.obtenerTodas()
  });
});

// GET /api/tareas/:id
router.get(
  '/:id',
  validarId,
  validar,
  (req, res) => {
    const tarea = tareasModel.obtenerPorId(Number(req.params.id));

    if (!tarea) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      mensaje: 'Tarea obtenida correctamente',
      tarea
    });
  }
);

// GET /api/tareas/:id/clima/:ciudad
router.get(
  '/:id/clima/:ciudad',
  validarId,
  validarCiudad,
  validar,
  async (req, res) => {
    const tarea = tareasModel.obtenerPorId(Number(req.params.id));

    if (!tarea) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    try {
      const clima = await climaService.obtenerClimaPorCiudad(req.params.ciudad);

      res.status(200).json({
        mensaje: 'Tarea y clima obtenidos correctamente',
        tarea,
        clima
      });
    } catch (error) {
      res.status(502).json({
        error: 'El servicio externo de clima falló',
        detalle: error.message
      });
    }
  }
);

// POST /api/tareas
router.post(
  '/',
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  validar,
  (req, res) => {
    const nuevaTarea = tareasModel.crear(req.body);

    res.status(201).json({
      mensaje: 'Tarea creada correctamente',
      tarea: nuevaTarea
    });
  }
);

// PUT /api/tareas/:id
router.put(
  '/:id',
  validarId,
  body('titulo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  body('completada')
    .optional()
    .isBoolean()
    .withMessage('Completada debe ser true o false'),
  validar,
  (req, res) => {
    const tareaActualizada = tareasModel.actualizar(
      Number(req.params.id),
      req.body
    );

    if (!tareaActualizada) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      mensaje: 'Tarea actualizada correctamente',
      tarea: tareaActualizada
    });
  }
);

// DELETE /api/tareas/:id
router.delete(
  '/:id',
  validarId,
  validar,
  (req, res) => {
    const eliminada = tareasModel.eliminar(Number(req.params.id));

    if (!eliminada) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.status(204).send();
  }
);

module.exports = router;