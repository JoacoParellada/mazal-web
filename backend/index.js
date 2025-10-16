const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// rutas de prueba
app.get("/", (req, res) => res.send("API Mazal Propiedades - OK"));

// conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mazal";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB conectado");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Error al conectar MongoDB:", err);
  });
