import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Generar token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/registro
// @access  Private (solo admin)
export const registro = asyncHandler(async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  const usuario = await User.create({
    nombre,
    email,
    password,
    rol: "admin",
    telefono,
  });

  // Generar token
  const token = generarToken(usuario._id);

  res.status(201).json({
    success: true,
    message: "Usuario registrado exitosamente",
    data: {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token,
    },
  });
});

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Por favor proporcione email y contraseña",
    });
  }

  // Buscar usuario (incluir password)
  const usuario = await User.findOne({ email }).select("+password");

  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }

  // Verificar contraseña
  const esPasswordValida = await usuario.compararPassword(password);

  if (!esPasswordValida) {
    return res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }

  // Verificar que el usuario esté activo
  if (!usuario.activo) {
    return res.status(401).json({
      success: false,
      message: "Usuario inactivo. Contacte al administrador",
    });
  }

  // Actualizar último acceso
  usuario.ultimoAcceso = Date.now();
  await usuario.save({ validateBeforeSave: false });

  // Generar token
  const token = generarToken(usuario._id);

  res.json({
    success: true,
    message: "Login exitoso",
    data: {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token,
    },
  });
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const obtenerUsuarioActual = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.user.id);

  res.json({
    success: true,
    data: usuario,
  });
});

// @desc    Actualizar contraseña
// @route   PUT /api/auth/actualizar-password
// @access  Private
export const actualizarPassword = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.user.id).select("+password");

  // Verificar contraseña actual
  const esPasswordValida = await usuario.compararPassword(
    req.body.passwordActual
  );

  if (!esPasswordValida) {
    return res.status(401).json({
      success: false,
      message: "Contraseña actual incorrecta",
    });
  }

  // Actualizar contraseña
  usuario.password = req.body.passwordNueva;
  await usuario.save();

  const token = generarToken(usuario._id);

  res.json({
    success: true,
    message: "Contraseña actualizada exitosamente",
    data: { token },
  });
});
