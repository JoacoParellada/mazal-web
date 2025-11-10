import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  Home,
  DollarSign,
  Users,
  Plus,
  Eye,
  CheckCircle,
} from "lucide-react";
import { AdminLayout } from "@components/layout/AdminLayout/AdminLayout";
import { Card, CardBody, CardHeader } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { propertiesAPI } from "@api/properties.api";
import { usersAPI } from "@api/users.api";
import styles from "./DashboardPage.module.css";

interface Stats {
  totalPropiedades: number;
  disponibles: number;
  vendidas: number;
  alquiladas: number;
  precioPromedio: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [porTipo, setPorTipo] = useState<any[]>([]);
  const [porOperacion, setPorOperacion] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, usersResponse] = await Promise.all([
        propertiesAPI.getStats(),
        usersAPI.getAll(),
      ]);

      setStats(statsResponse.data.resumen);
      setPorTipo(statsResponse.data.porTipo);
      setPorOperacion(statsResponse.data.porOperacion);
      setTotalUsers(usersResponse.count);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Loader fullScreen />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Propiedades",
      value: stats?.totalPropiedades || 0,
      icon: <Building2 size={32} />,
      color: "#2563eb",
      link: "/admin/propiedades",
    },
    {
      title: "Disponibles",
      value: stats?.disponibles || 0,
      icon: <CheckCircle size={32} />,
      color: "#10b981",
      link: "/admin/propiedades?estado=disponible",
    },
    {
      title: "Vendidas",
      value: stats?.vendidas || 0,
      icon: <DollarSign size={32} />,
      color: "#f59e0b",
      link: "/admin/propiedades?estado=vendida",
    },
    {
      title: "Usuarios",
      value: totalUsers,
      icon: <Users size={32} />,
      color: "#8b5cf6",
      link: "/admin/usuarios",
    },
  ];

  const tipoLabels: { [key: string]: string } = {
    casa: "Casas",
    departamento: "Departamentos",
    local: "Locales",
    terreno: "Terrenos",
    oficina: "Oficinas",
    ph: "PH",
    quinta: "Quintas",
  };

  const operacionLabels: { [key: string]: string } = {
    venta: "Venta",
    alquiler: "Alquiler",
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Resumen general de la inmobiliaria
            </p>
          </div>
          <Link to="/admin/propiedades/nueva">
            <Button variant="primary" icon={<Plus size={20} />}>
              Nueva Propiedad
            </Button>
          </Link>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <Link to={stat.link} key={index} className={styles.statLink}>
              <Card hoverable>
                <CardBody>
                  <div className={styles.statCard}>
                    <div
                      className={styles.statIcon}
                      style={{ backgroundColor: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div className={styles.statInfo}>
                      <h3 className={styles.statValue}>{stat.value}</h3>
                      <p className={styles.statLabel}>{stat.title}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        <div className={styles.chartsGrid}>
          {/* Propiedades por tipo */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Propiedades por Tipo</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.chartList}>
                {porTipo.map((item, index) => (
                  <div key={index} className={styles.chartItem}>
                    <div className={styles.chartLabel}>
                      <Home size={18} />
                      <span>{tipoLabels[item._id] || item._id}</span>
                    </div>
                    <div className={styles.chartValue}>
                      <span className={styles.chartNumber}>
                        {item.cantidad}
                      </span>
                      <div className={styles.chartBar}>
                        <div
                          className={styles.chartBarFill}
                          style={{
                            width: `${
                              (item.cantidad / (stats?.totalPropiedades || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {porTipo.length === 0 && (
                  <p className={styles.emptyMessage}>
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Propiedades por operación */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Propiedades por Operación</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.chartList}>
                {porOperacion.map((item, index) => (
                  <div key={index} className={styles.chartItem}>
                    <div className={styles.chartLabel}>
                      <TrendingUp size={18} />
                      <span>{operacionLabels[item._id] || item._id}</span>
                    </div>
                    <div className={styles.chartValue}>
                      <span className={styles.chartNumber}>
                        {item.cantidad}
                      </span>
                      <div className={styles.chartBar}>
                        <div
                          className={styles.chartBarFill}
                          style={{
                            width: `${
                              (item.cantidad / (stats?.totalPropiedades || 1)) *
                              100
                            }%`,
                            backgroundColor:
                              item._id === "venta" ? "#10b981" : "#06b6d4",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {porOperacion.length === 0 && (
                  <p className={styles.emptyMessage}>
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Accesos Rápidos</h2>
          </CardHeader>
          <CardBody>
            <div className={styles.quickActions}>
              <Link to="/admin/propiedades/nueva">
                <Button variant="outline" icon={<Plus size={20} />}>
                  Nueva Propiedad
                </Button>
              </Link>
              <Link to="/admin/propiedades">
                <Button variant="outline" icon={<Eye size={20} />}>
                  Ver Propiedades
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" icon={<Home size={20} />}>
                  Ver Sitio Público
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
