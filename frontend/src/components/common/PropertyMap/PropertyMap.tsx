interface PropertyMapProps {
  calle?: string;
  numero?: string;
  ciudad: string;
  provincia: string;
  titulo: string;
}

const PropertyMap = ({
  calle,
  numero,
  ciudad,
  provincia,
  titulo,
}: PropertyMapProps) => {
  // 1. Construimos una dirección ultra-específica.
  // Es vital que el orden sea: Calle Numero, Ciudad, Provincia, País.
  // Forzamos "Mendoza, Argentina" al final para que no busque en otras provincias o países.
  const direccionCompleta = `${calle || ""} ${numero || ""}, ${ciudad}, ${provincia}, Argentina`;

  // 2. Usamos la URL oficial de Embed de Google Maps.
  // Cambié el zoom (z=15) por (z=17) para que se vea bien la cuadra y no haya dudas de la ubicación.
  const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    direccionCompleta,
  )}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", // Un toque estético para tu tesis
      }}
    >
      <iframe
        title={`Ubicación de ${titulo}`}
        src={googleMapsUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default PropertyMap;
