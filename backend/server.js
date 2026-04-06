import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware de body (una sola vez, con límite)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Servir archivos estáticos (imágenes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conectar a la base de datos
connectDB();

// Normalizar posibles envoltorios de import (ej. { default: router })
const normalizeRouter = (r) => (r && r.default ? r.default : r);
const propRouter = normalizeRouter(propertyRoutes);
const usrRouter = normalizeRouter(userRoutes);
const athRouter = normalizeRouter(authRoutes);

// Rutas
app.use("/api/propiedades", propRouter);
app.use("/api/usuarios", usrRouter);
app.use("/api/auth", athRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Mazal Propiedades funcionando",
    version: "1.0.0",
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`),
);

// Manejo de promesas no capturadas
process.on("unhandledRejection", (err) => {
  console.error(`❌ Error: ${err?.message ?? err}`);
  server.close(() => process.exit(1));
});
