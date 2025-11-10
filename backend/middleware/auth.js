import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Proteger rutas - verificar JWT
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token está en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado para acceder a esta ruta",
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario y agregarlo al request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!req.user.activo) {
      return res.status(401).json({
        success: false,
        message: "Usuario inactivo",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
});

// Autorización por roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.rol} no está autorizado para acceder a esta ruta`,
      });
    }
    next();
  };
};
