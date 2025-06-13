// frontend/src/pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { isApiError } from "../utils/typeGuards";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password }); // CORRIGIDO: Removido '/api'
      const { token, user } = response.data;
      signIn(token, user);
      alert(`Login de ${user.name} realizado com sucesso!`);
      navigate("/");
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || "Erro ao fazer login.");
      } else {
        setError("Ocorreu um erro desconhecido ao tentar fazer login.");
      }
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="card-title text-center mb-4 text-success">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">
              Entrar
            </button>
            <Link to="/register" className="btn btn-outline-secondary">
              Criar Conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
