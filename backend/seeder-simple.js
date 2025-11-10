import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const crearAdmin = async () => {
  try {
    // Eliminar usuarios existentes
    await User.deleteMany();

    // Crear admin
    const admin = await User.create({
      nombre: "admin",
      email: "admin@admin.com",
      password: "admin123",
      rol: "admin",
      telefono: "+54 261 123-4567",
    });

    console.log("✅ Usuario admin creado exitosamente");
    console.log("Email:", admin.email);
    console.log("Password: admin123");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

crearAdmin();
