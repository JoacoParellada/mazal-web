import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Obtener todos los usuarios
// @route   GET /api/usuarios
// @access  Private (admin, supervisor)
export const obtenerUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await User.find({ eliminado: false }).select("-password");

  res.json({
    success: true,
    count: usuarios.length,
    data: usuarios,
  });
});

// @desc    Obtener usuario por ID
// @route   GET /api/usuarios/:id
// @access  Private (admin, supervisor)
export const obtenerUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.findOne({
    _id: req.params.id,
    eliminado: false,
  }).select("-password");

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  res.json({
    success: true,
    data: usuario,
  });
});

// @desc    Actualizar usuario
// @route   PUT /api/usuarios/:id
// @access  Private (admin)
export const actualizarUsuario = asyncHandler(async (req, res) => {
  // Campos que se pueden actualizar
  const camposPermitidos = {
    nombre: req.body.nombre,
    email: req.body.email,
    rol: req.body.rol,
    telefono: req.body.telefono,
    activo: req.body.activo,
  };

  const usuario = await User.findOneAndUpdate(
    { _id: req.params.id, eliminado: false },
    camposPermitidos,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  res.json({
    success: true,
    message: "Usuario actualizado exitosamente",
    data: usuario,
  });
});

// @desc    Desactivar usuario
// @route   PUT /api/usuarios/:id/desactivar
// @access  Private (admin)
export const desactivarUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.findOne({
    _id: req.params.id,
    eliminado: false,
  });

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  usuario.activo = false;
  await usuario.save();

  res.json({
    success: true,
    message: "Usuario desactivado exitosamente",
    data: usuario,
  });
});

// @desc    Activar usuario
// @route   PUT /api/usuarios/:id/activar
// @access  Private (admin)
export const activarUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.findOne({
    _id: req.params.id,
    eliminado: false,
  });

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  usuario.activo = true;
  await usuario.save();

  res.json({
    success: true,
    message: "Usuario activado exitosamente",
    data: usuario,
  });
});

// @desc    Eliminar usuario
// @route   DELETE /api/usuarios/:id
// @access  Private (admin)
export const eliminarUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.findOne({
    _id: req.params.id,
    eliminado: false,
  });

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  usuario.eliminado = true;
  usuario.activo = false;
  usuario.fechaEliminacion = new Date();
  await usuario.save();

  res.json({
    success: true,
    message: "Usuario eliminado exitosamente",
    data: {},
  });
});
