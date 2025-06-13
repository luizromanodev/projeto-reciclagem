// frontend/src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { isApiError } from "../utils/typeGuards";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CITIZEN" | "COMPANY" | "COOPERATIVE">(
    "CITIZEN"
  );
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        // CORRIGIDO: Removido '/api'
        name,
        email,
        password,
        role,
      });
      const { token, user } = response.data;
      // Armazena o token da cooperativa para poder usar a rota de seed de materiais
      if (user.role === "COOPERATIVE") {
        localStorage.setItem("cooperativeToken", token);
      }
      signIn(token, user); // Loga o usuário diretamente após o registro
      alert(`Cadastro de ${user.name} (${user.role}) realizado com sucesso!`);
      navigate("/");
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || "Erro ao registrar.");
      } else {
        setError("Ocorreu um erro desconhecido ao tentar registrar.");
      }
      console.error("Erro no registro:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="card-title text-center mb-4 text-success">
          Cadastre-se
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome:
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Tipo de Usuário:
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "CITIZEN" | "COMPANY" | "COOPERATIVE")
              }
            >
              <option value="CITIZEN">Cidadão</option>
              <option value="COMPANY">Empresa</option>
              <option value="COOPERATIVE">Cooperativa</option>
            </select>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">
              Cadastrar
            </button>
            <Link to="/login" className="btn btn-outline-secondary">
              Já tem conta? Faça Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
