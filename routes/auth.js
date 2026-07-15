const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const usuariosModel = require('../models/usuarios');
const verificarToken = require('../middleware/auth');

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

// POST /api/auth/registro
router.post(
  '/registro',
  body('correo')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  validar,

  async (req, res) => {
    const { correo, password } = req.body;

    const usuarioExistente = usuariosModel.buscarPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(409).json({
        error: 'El correo ya está registrado'
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const usuario = usuariosModel.crear(correo, hashPassword);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: usuario.id,
        correo: usuario.correo
      }
    });
  }
);

// POST /api/auth/login
router.post(
  '/login',
  body('correo')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),

  validar,

  async (req, res) => {
    const { correo, password } = req.body;

    const usuario = usuariosModel.buscarPorCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.status(200).json({
      mensaje: 'Login correcto',
      token
    });
  }
);

// GET /api/auth/perfil
router.get('/perfil', verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: 'Perfil obtenido correctamente',
    usuario: req.usuario
  });
});

module.exports = router;