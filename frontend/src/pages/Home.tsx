// frontend/src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { isApiError } from "../utils/typeGuards";
import type { User, Collection } from "../types/global";
// <<< CORREÇÃO AQUI: Importar User, Material e Collection do global.d.ts

// TIPAGENS ESPECÍFICAS DESTA PÁGINA
interface Stats {
  activeUsers: number;
  wasteRecycled: number;
  partnerCooperatives: number;
}

// A interface Collection não precisa ser redeclarada aqui, pois está em global.d.ts
// interface Collection { ... }

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    activeUsers: 0,
    wasteRecycled: 0,
    partnerCooperatives: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setError(null);
        // Exemplo: Buscar número de usuários e cooperativas
        const usersResponse = await api.get<User[]>("/api/users", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("cooperativeToken") || ""
            }`,
          },
        });
        const allUsers = usersResponse.data;

        // Exemplo: Buscar total de resíduos reciclados (filtrando por status COMPLETED)
        // <<< Usando Collection[] para tipar a resposta da API aqui
        const collectionsResponse = await api.get<Collection[]>(
          "/api/collections",
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("cooperativeToken") || ""
              }`,
            },
            params: {
              status: "COMPLETED",
            },
          }
        );
        const completedCollections = collectionsResponse.data;
        const totalWeightRecycled = completedCollections.reduce(
          (sum: number, col: Collection) => sum + (col.weightKg || 0),
          0
        );

        setStats({
          activeUsers: allUsers.length,
          wasteRecycled: totalWeightRecycled,
          partnerCooperatives: allUsers.filter(
            (u: User) => u.role === "COOPERATIVE"
          ).length,
        });
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(
            err.response?.data?.message || "Erro ao carregar estatísticas."
          );
        } else {
          setError("Ocorreu um erro desconhecido ao carregar estatísticas.");
        }
        console.error("Erro ao carregar estatísticas:", err);
      }
    };

    loadStats();
  }, [isAuthenticated, user]);

  return (
    <div className="container mt-5 pt-5">
      <section className="text-center my-5">
        <h1 className="display-4 fw-bold text-success mb-3">
          Gestão Inteligente de Resíduos para Cidades Sustentáveis
        </h1>
        <p className="lead text-muted mb-4">
          Conectamos cidadãos, empresas e cooperativas de reciclagem para tornar
          a coleta de resíduos mais eficiente, sustentável e colaborativa.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-center">
          {isAuthenticated &&
          (user?.role === "CITIZEN" || user?.role === "COMPANY") ? (
            <Link to="/schedule" className="btn btn-success btn-lg px-4">
              Agendar Coleta
            </Link>
          ) : isAuthenticated && user?.role === "COOPERATIVE" ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg px-4">
              Ver Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-success btn-lg px-4">
              Acessar Plataforma
            </Link>
          )}
          <a href="#info" className="btn btn-outline-secondary btn-lg px-4">
            Saiba Mais
          </a>
        </div>
      </section>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <section className="row text-center my-5">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <i className="bi bi-people-fill text-success fs-1 mb-3"></i>
            <h3 className="card-title fw-bold">{stats.activeUsers}+</h3>
            <p className="card-text text-muted">Usuários Ativos</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <i className="bi bi-recycle text-success fs-1 mb-3"></i>
            <h3 className="card-title fw-bold">{stats.wasteRecycled} kg</h3>
            <p className="card-text text-muted">Resíduos Reciclados</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <i className="bi bi-geo-alt-fill text-success fs-1 mb-3"></i>
            <h3 className="card-title fw-bold">{stats.partnerCooperatives}</h3>
            <p className="card-text text-muted">Cooperativas Parceiras</p>
          </div>
        </div>
      </section>

      <section id="info" className="my-5 py-5 bg-light rounded shadow-sm">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Como Funciona & Benefícios</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <p className="text-muted text-center">
              Nossa plataforma simplifica a reciclagem, conecta comunidades e
              promove um futuro mais sustentável.
            </p>
            <ul className="list-unstyled text-muted text-center mt-4">
              <li>- Cadastro rápido para cidadãos e empresas.</li>
              <li>- Agendamento de coleta flexível.</li>
              <li>- Transparência e rastreamento.</li>
              <li>- Valorização dos catadores.</li>
              <li>- Redução do impacto ambiental.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
