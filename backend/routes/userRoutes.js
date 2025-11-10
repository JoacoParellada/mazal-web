import express from "express";

import {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
} from "../controllers/userControllers.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Todas las rutas requieren autenticación y rol admin o supervisor
router.use(protect);
router.use(authorize("admin", "supervisor"));

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuario);

// Solo admin
router.put("/:id", authorize("admin"), actualizarUsuario);
router.put("/:id/desactivar", authorize("admin"), desactivarUsuario);
router.put("/:id/activar", authorize("admin"), activarUsuario);
router.delete("/:id", authorize("admin"), eliminarUsuario);

export default router;
