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
  const direccion = [calle, numero, ciudad, provincia, "Argentina"]
    .filter(Boolean)
    .join(", ");

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed&z=15`;

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <iframe
        title={`Mapa de ${titulo}`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default PropertyMap;
