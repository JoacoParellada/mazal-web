import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Footer } from "@components/layout/Footer/Footer";
import { PropertyCard } from "@components/properties/PropertyCard/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters/PropertyFilters";
import { Loader } from "@components/common/Loader/Loader";
import { Button } from "@components/common/Button/Button";
import { usePropertiesStore } from "@store/propertiesStore";
import { PropertyFilters as PropertyFiltersType } from "@/types/propierties.types";
import { Building2, SlidersHorizontal } from "lucide-react";
import styles from "./PropertiesPage.module.css";
import { Navbar } from "@/components/layout/Navbar/NavBar";

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { properties, isLoading, total, fetchProperties, filters, setFilters } =
    usePropertiesStore();

  useEffect(() => {
    // Leer filtros de URL
    const urlFilters: PropertyFiltersType = {};

    searchParams.forEach((value, key) => {
      if (
        key === "precioMin" ||
        key === "precioMax" ||
        key === "ambientes" ||
        key === "dormitorios"
      ) {
        urlFilters[key] = Number(value);
      } else if (key === "destacada") {
        urlFilters[key] = value === "true";
      } else {
        urlFilters[key] = value;
      }
    });

    setFilters(urlFilters);
    fetchProperties(urlFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  const loadMore = () => {
    const newFilters = {
      ...filters,
      page: (filters.page || 1) + 1,
    };
    fetchProperties(newFilters);
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>Propiedades</h1>
            <p className={styles.subtitle}>
              Encontramos {total} {total === 1 ? "propiedad" : "propiedades"}
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.content}>
            {/* Botón mobile para mostrar filtros */}
            <div className={styles.mobileFilterButton}>
              <Button
                variant="outline"
                fullWidth
                icon={<SlidersHorizontal size={20} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {/* Sidebar de filtros */}
            <aside
              className={`${styles.sidebar} ${
                showFilters ? styles.showMobile : ""
              }`}
            >
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </aside>

            {/* Lista de propiedades */}
            <main className={styles.main}>
              {isLoading && properties.length === 0 ? (
                <div className={styles.loaderContainer}>
                  <Loader size="lg" />
                </div>
              ) : (
                <>
                  {properties.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Building2 size={64} />
                      <h3>No se encontraron propiedades</h3>
                      <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.grid}>
                        {properties.map((property) => (
                          <PropertyCard
                            key={property._id}
                            property={property}
                          />
                        ))}
                      </div>

                      {properties.length < total && (
                        <div className={styles.loadMoreContainer}>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={loadMore}
                            isLoading={isLoading}
                          >
                            Cargar Más Propiedades
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PropertiesPage;
