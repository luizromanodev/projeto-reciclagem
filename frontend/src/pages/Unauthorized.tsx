import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-4">
      <h1 className="display-4 text-danger mb-3">Acesso Negado!</h1>
      <p className="lead text-muted mb-4">
        Você não tem permissão para acessar esta página.
      </p>
      <Link to="/" className="btn btn-primary btn-lg mb-2">
        Voltar para a Página Inicial
      </Link>
      <Link to="/login" className="btn btn-outline-secondary">
        Tentar fazer login com outra conta
      </Link>
    </div>
  );
};

export default Unauthorized;
