const express = require('express');
const { param, validationResult } = require('express-validator');

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

const validarCiudad = param('ciudad')
  .trim()
  .notEmpty()
  .withMessage('La ciudad no debe estar vacía')
  .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/)
  .withMessage('La ciudad solo puede contener letras, espacios o guiones');

// GET /api/clima/:ciudad
router.get(
  '/:ciudad',
  validarCiudad,
  validar,
  async (req, res) => {
    try {
      const clima = await climaService.obtenerClimaPorCiudad(req.params.ciudad);

      res.status(200).json({
        mensaje: 'Clima obtenido correctamente',
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

module.exports = router;