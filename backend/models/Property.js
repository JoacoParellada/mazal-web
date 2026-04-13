import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, "El tipo de propiedad es obligatorio"],
      enum: {
        values: [
          "casa",
          "departamento",
          "local",
          "terreno",
          "oficina",
          "ph",
          "quinta",
        ],
        message: "{VALUE} no es un tipo válido",
      },
    },
    operacion: {
      type: String,
      required: [true, "El tipo de operación es obligatorio"],
      enum: {
        values: ["venta", "alquiler"],
        message: "{VALUE} no es una operación válida",
      },
    },
    direccion: {
      calle: { type: String, required: true, trim: true },
      numero: { type: String, required: true, trim: true },
      piso: { type: String, trim: true },
      departamento: { type: String, trim: true },
      barrio: { type: String, trim: true },
      ciudad: { type: String, required: true, trim: true },
      provincia: { type: String, required: true, trim: true },
      codigoPostal: { type: String, required: true, trim: true },
      ubicacion: { type: String, trim: true },
    },
    superficie: {
      total: {
        type: Number,
        min: [0, "La superficie no puede ser negativa"],
      },
      cubierta: {
        type: Number,
        min: [0, "La superficie no puede ser negativa"],
      },
    },
    ambientes: {
      type: Number,
      min: [0, "Los ambientes no pueden ser negativos"],
    },
    dormitorios: {
      type: Number,
      min: [0, "Los dormitorios no pueden ser negativos"],
    },
    banos: {
      type: Number,
      min: [0, "Los baños no pueden ser negativos"],
    },
    cocheras: {
      type: Number,
      default: 0,
      min: [0, "Las cocheras no pueden ser negativas"],
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    moneda: {
      type: String,
      enum: ["USD", "ARS"],
      default: "USD",
    },
    expensas: {
      type: Number,
      min: [0, "Las expensas no pueden ser negativas"],
    },
    imagenes: [
      {
        url: { type: String, required: true },
        filename: { type: String }, // Nombre del archivo en el servidor
        esPrincipal: { type: Boolean, default: false },
        orden: { type: Number, default: 0 },
      },
    ],
    estado: {
      type: String,
      enum: ["disponible", "reservada", "vendida", "alquilada"],
      default: "disponible",
    },
    destacada: {
      type: Boolean,
      default: false,
      index: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    eliminado: {
      type: Boolean,
      default: false,
      index: true,
    },
    fechaEliminacion: {
      type: Date,
      default: null,
    },
    fechaPublicacion: {
      type: Date,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Índices para mejorar el rendimiento de las búsquedas
propertySchema.index({ tipo: 1, operacion: 1 });
propertySchema.index({ precio: 1 });
propertySchema.index({ "direccion.ciudad": 1, "direccion.provincia": 1 });
propertySchema.index({ estado: 1, visible: 1 });
propertySchema.index({ eliminado: 1, createdAt: -1 });

// Virtual para URL amigable (slug)
propertySchema.virtual("slug").get(function () {
  return this.titulo
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
});

export default mongoose.model("Property", propertySchema);
