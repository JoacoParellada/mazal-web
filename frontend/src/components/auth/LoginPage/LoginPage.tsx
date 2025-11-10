import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Building2 } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Input } from "@components/common/Input/Input";
import { Button } from "@components/common/Button/Button";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("¡Bienvenido!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Building2 size={48} className={styles.logo} />
          <h1>Iniciar Sesión</h1>
          <p>Panel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            required
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={20} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Ingresar
          </Button>
        </form>

        <div className={styles.footer}>
          <a href="/" className={styles.link}>
            ← Volver al sitio
          </a>
        </div>
      </div>

      <div className={styles.testCredentials}>
        <h3>Credenciales de prueba:</h3>
        <p>
          <strong>Email:</strong> admin@inmobiliaria.com
        </p>
        <p>
          <strong>Password:</strong> admin123
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
