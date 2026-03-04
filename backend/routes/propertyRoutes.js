import express from "express";
import { body } from "express-validator";
import {
  obtenerPropiedades,
  obtenerPropiedad,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  cambiarVisibilidad,
  destacarPropiedad,
  obtenerEstadisticas,
  obtenerDestacadas,
  eliminarImagen,
  obtenerPropiedadesAdmin,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

// Validaciones para crear/actualizar propiedad
const validacionPropiedad = [
  body("titulo").trim().notEmpty().withMessage("El título es obligatorio"),
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria"),
  body("tipo")
    .isIn([
      "casa",
      "departamento",
      "local",
      "terreno",
      "oficina",
      "ph",
      "quinta",
    ])
    .withMessage("Tipo inválido"),
  body("operacion")
    .isIn(["venta", "alquiler"])
    .withMessage("Operación inválida"),
  body("precio").isNumeric().withMessage("El precio debe ser numérico"),
  body("direccion.ciudad")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria"),
  body("direccion.provincia")
    .trim()
    .notEmpty()
    .withMessage("La provincia es obligatoria"),
];

// Rutas públicas (estáticas primero)
router.get("/destacadas", obtenerDestacadas);
router.get("/", obtenerPropiedades);

// Rutas privadas (estáticas antes que dinámicas)
router.get(
  "/admin/todas",
  protect,
  authorize("agente", "supervisor", "admin"),
  obtenerPropiedadesAdmin,
);

router.get(
  "/stats/resumen",
  protect,
  authorize("supervisor", "admin"),
  obtenerEstadisticas,
);

// Rutas privadas
router.use(protect); // Todas las rutas siguientes requieren autenticación

router.post(
  "/",
  protect,
  authorize("agente", "supervisor", "admin"),
  upload.array("imagenes", 10),
  validacionPropiedad,
  validateRequest,
  crearPropiedad,
);

router.put(
  "/:id",
  protect,
  authorize("agente", "supervisor", "admin"),
  upload.array("imagenes", 10),
  actualizarPropiedad,
);

router.delete(
  "/:id",
  protect,
  authorize("supervisor", "admin"),
  eliminarPropiedad,
);

router.delete(
  "/:id/imagenes/:imageId",
  protect,
  authorize("agente", "supervisor", "admin"),
  eliminarImagen,
);

router.put(
  "/:id/visibilidad",
  protect,
  authorize("agente", "supervisor", "admin"),
  cambiarVisibilidad,
);

router.put(
  "/:id/destacar",
  authorize("supervisor", "admin"),
  destacarPropiedad,
);

// Ruta pública dinámica
router.get("/:id", obtenerPropiedad);

export default router;
