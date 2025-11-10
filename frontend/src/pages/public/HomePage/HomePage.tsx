import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, TrendingUp, Award } from "lucide-react";
import { Footer } from "@components/layout/Footer/Footer";
import { Button } from "@components/common/Button/Button";
import { usePropertiesStore } from "@store/propertiesStore";
import { Loader } from "@components/common/Loader/Loader";
import styles from "./HomePage.module.css";
import { Navbar } from "@/components/layout/Navbar/NavBar";
import { PropertyCard } from "@/components/properties/PropertyCard/PropertyCard";

const HomePage = () => {
  const { properties, isLoading, fetchFeaturedProperties } =
    usePropertiesStore();

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  const features = [
    {
      icon: <Search size={32} />,
      title: "Búsqueda Avanzada",
      description:
        "Encuentra la propiedad perfecta con nuestros filtros inteligentes",
    },
    {
      icon: <Building2 size={32} />,
      title: "Amplio Catálogo",
      description: "Miles de propiedades en venta y alquiler en toda la región",
    },
    {
      icon: <Award size={32} />,
      title: "Asesoramiento Profesional",
      description: "Equipo experto para ayudarte en cada paso del proceso",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Mejor Inversión",
      description: "Te ayudamos a tomar la mejor decisión para tu futuro",
    },
  ];

  return (
    <>
      <Navbar />

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Encuentra tu hogar ideal</h1>
          <p className={styles.heroSubtitle}>
            Las mejores propiedades en venta y alquiler en Mendoza
          </p>
          <div className={styles.heroActions}>
            <Link to="/propiedades?operacion=venta">
              <Button variant="primary" size="lg">
                Ver Propiedades en Venta
              </Button>
            </Link>
            <Link to="/propiedades?operacion=alquiler">
              <Button variant="primary" size="lg">
                Ver Propiedades en Alquiler
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Propiedades Destacadas</h2>
          <p className={styles.sectionSubtitle}>
            Nuestras mejores opciones seleccionadas para ti
          </p>

          {isLoading ? (
            <div className={styles.loaderContainer}>
              <Loader size="lg" />
            </div>
          ) : (
            <>
              <div className={styles.propertiesGrid}>
                {properties.slice(0, 6).map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {properties.length === 0 && (
                <div className={styles.emptyState}>
                  <Building2 size={64} />
                  <p>No hay propiedades destacadas disponibles</p>
                </div>
              )}

              {properties.length > 0 && (
                <div className={styles.viewAllContainer}>
                  <Link to="/propiedades">
                    <Button variant="primary" size="lg">
                      Ver Todas las Propiedades
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
