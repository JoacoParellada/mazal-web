import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const crearAdmin = async () => {
  try {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Debes definir ADMIN_EMAIL y ADMIN_PASSWORD en variables de entorno"
      );
    }

    // Eliminar usuarios existentes
    await User.deleteMany();

    // Crear admin
    const admin = await User.create({
      nombre: "Administrador",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      rol: "admin",
      telefono: "+54 261 123-4567",
    });

    console.log("✅ Usuario admin creado exitosamente");
    console.log("Email:", admin.email);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

crearAdmin();
