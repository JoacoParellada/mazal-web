import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/Property.js";

dotenv.config();

const fixAmenities = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Obtener todas las propiedades
    const properties = await Property.find({});
    console.log(`📋 Encontradas ${properties.length} propiedades`);

    let fixed = 0;

    for (const property of properties) {
      let needsUpdate = false;
      let cleanedAmenities = [];

      if (property.amenities && property.amenities.length > 0) {
        cleanedAmenities = property.amenities
          .map((amenity) => {
            // Si el amenity es un string que parece JSON malformado
            if (typeof amenity === "string") {
              // Intentar parsear si viene con escape characters
              try {
                const parsed = JSON.parse(amenity);
                if (Array.isArray(parsed)) {
                  needsUpdate = true;
                  return parsed;
                }
              } catch (e) {
                // No es JSON, mantener como está
              }

              // Limpiar caracteres de escape
              if (amenity.includes('\\"') || amenity.includes("\\n")) {
                needsUpdate = true;
                return amenity
                  .replace(/\\"/g, '"')
                  .replace(/\\n/g, "")
                  .replace(/^\["|"\]$/g, "")
                  .replace(/","/g, ",")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
            }
            return amenity;
          })
          .flat(); // Aplanar en caso de arrays anidados

        if (needsUpdate) {
          property.amenities = cleanedAmenities;
          await property.save();
          fixed++;
          console.log(
            `✅ Propiedad ${property._id} (${property.titulo}) - Amenities corregidos`
          );
        }
      }
    }

    console.log(`\n✅ Proceso completado: ${fixed} propiedades actualizadas`);

    // Mostrar algunos ejemplos
    const samples = await Property.find({
      amenities: { $exists: true, $ne: [] },
    }).limit(3);
    console.log("\n📋 Ejemplos de amenities después de la corrección:");
    samples.forEach((prop) => {
      console.log(`\n${prop.titulo}:`);
      console.log(prop.amenities);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAmenities();
