import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/Home";
import ScheduleCollection from "./pages/ScheduleCollection";
import Dashboard from "./pages/Dashboard";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand text-success fw-bold" to="/">
            EcoColeta
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/schedule">
                  Agendar Coleta
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <LogoutButton /> {/* Componente de botão de logout */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: "56px" }}>
        {" "}
        {/* Espaço para a navbar fixa */}
        {children}
      </div>
      {/* Footer simples */}
      <footer className="bg-success text-white text-center py-3 mt-auto">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} EcoColeta. Todos os direitos
          reservados.
        </p>
      </footer>
    </>
  );
};

// Componente para o botão de Logout (para ser usado na Navbar)
const LogoutButton: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  if (!isAuthenticated)
    return (
      <Link to="/login" className="btn btn-outline-success">
        Acessar Plataforma
      </Link>
    );

  return (
    <button onClick={signOut} className="btn btn-danger ms-2">
      Sair ({user?.name})
    </button>
  );
};

// Componente PrivateRoute para proteger rotas
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("CITIZEN" | "COMPANY" | "COOPERATIVE")[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-secondary">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rota da Landing Page / Home */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      {/* Rotas Protegidas */}
      <Route
        path="/schedule"
        element={
          <PrivateRoute allowedRoles={["CITIZEN", "COMPANY"]}>
            <ScheduleCollection />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["COOPERATIVE"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Rota para 404 - Página não encontrada (redireciona para home) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
