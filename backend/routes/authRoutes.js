import express from "express";
import { body } from "express-validator";
import {
  registro,
  login,
  obtenerUsuarioActual,
  actualizarPassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/registro",
  protect,
  authorize("admin"),
  [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol")
      .isIn(["admin", "agente", "supervisor"])
      .withMessage("Rol inválido"),
  ],
  validateRequest,
  registro
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  validateRequest,
  login
);
router.get("/me", protect, obtenerUsuarioActual);
router.put(
  "/actualizar-password",
  protect,
  [
    body("passwordActual")
      .notEmpty()
      .withMessage("La contraseña actual es obligatoria"),
    body("passwordNueva")
      .isLength({ min: 6 })
      .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
  ],
  validateRequest,
  actualizarPassword
);

export default router;
