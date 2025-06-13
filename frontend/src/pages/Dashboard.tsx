import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isApiError } from "../utils/typeGuards";
import Unauthorized from "./Unauthorized";
import type { Collection } from "../types/global";

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingCollections, setLoadingCollections] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      if (user?.role !== "COOPERATIVE") {
        setError(
          "Acesso negado: Você não é uma cooperativa. Redirecionando..."
        );
        return;
      }
      try {
        setLoadingCollections(true);
        const response = await api.get<Collection[]>("/collections");

        setCollections(response.data);
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(err.response?.data?.message || "Erro ao carregar coletas.");
        } else {
          setError("Ocorreu um erro desconhecido ao carregar coletas.");
        }
        console.error("Erro ao carregar coletas para dashboard:", err);
      } finally {
        setLoadingCollections(false);
      }
    };
    if (user) {
      fetchCollections();
    }
  }, [user, navigate]);

  // Interface para tipar o payload de atualização de status
  interface UpdateStatusPayload {
    status: "IN_ROUTE" | "COMPLETED" | "CANCELED";
    cooperativeId?: string; // Opcional, para quando a cooperativa assume a coleta
    weightKg?: number; // Opcional, para quando a coleta é concluída
  }

  const handleUpdateStatus = async (
    collectionId: string,
    newStatus: "IN_ROUTE" | "COMPLETED" | "CANCELED"
  ) => {
    if (!user || user.role !== "COOPERATIVE") {
      alert("Você não tem permissão para atualizar coletas.");
      return;
    }
    try {
      const currentCollection = collections.find((c) => c.id === collectionId);
      const payload: UpdateStatusPayload = { status: newStatus };

      if (newStatus === "IN_ROUTE" && !currentCollection?.cooperativeId) {
        payload.cooperativeId = user.id; // Atribui a cooperativa logada
      }
      if (newStatus === "COMPLETED") {
        const weightInput = prompt(
          "Informe o peso total em KG (número decimal):"
        );
        if (
          weightInput !== null &&
          !isNaN(Number(weightInput)) &&
          parseFloat(weightInput) >= 0
        ) {
          payload.weightKg = parseFloat(weightInput);
        } else if (weightInput !== null) {
          // Usuário inseriu algo, mas é inválido
          alert("Peso inválido. A coleta não será concluída.");
          return;
        } else {
          // Usuário cancelou o prompt
          return;
        }
      }

      const response = await api.put<Collection>(
        `/collections/${collectionId}/status`,
        payload
      );
      alert(
        `Coleta #${collectionId.substring(0, 8)} atualizada para ${newStatus}!`
      );
      setCollections((prevCollections) =>
        prevCollections.map((c) => (c.id === collectionId ? response.data : c))
      );
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(
          err.response?.data?.message || "Erro ao atualizar status da coleta."
        );
      } else {
        setError("Ocorreu um erro desconhecido ao atualizar status da coleta.");
      }
      console.error("Erro ao atualizar status:", err);
    }
  };

  if (loadingCollections) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Carregando coletas...</span>
      </div>
    );
  }

  if (user?.role !== "COOPERATIVE") {
    return <Unauthorized />;
  }

  return (
    <div className="container mt-5 pt-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-success">Painel da Cooperativa: {user.name}</h1>
        <button onClick={signOut} className="btn btn-danger">
          Sair
        </button>
      </header>

      <main className="bg-white p-4 rounded shadow-sm">
        <h2 className="h4 mb-3">Coletas Pendentes e Atribuídas</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {collections.length === 0 ? (
          <p className="text-muted">Nenhuma coleta a ser exibida no momento.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {collections.map((collection) => (
              <div className="col" key={collection.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      Coleta #{collection.id.substring(0, 8)}
                    </h5>
                    <p className="card-text mb-1">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          collection.status === "SCHEDULED"
                            ? "bg-info"
                            : collection.status === "IN_ROUTE"
                            ? "bg-warning text-dark"
                            : collection.status === "COMPLETED"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {collection.status}
                      </span>
                    </p>
                    <p className="card-text mb-1">
                      <strong>Material:</strong>{" "}
                      {collection.materials
                        .map(
                          (m) =>
                            m.material.name +
                            (m.quantity ? ` (${m.quantity})` : "")
                        )
                        .join(", ")}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Data:</strong>{" "}
                      {new Date(collection.pickupDate).toLocaleString()}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Solicitante:</strong> {collection.requester.name}{" "}
                      ({collection.requester.email})
                    </p>
                    {collection.requester.address && (
                      <p className="card-text mb-1">
                        <strong>Endereço:</strong>{" "}
                        {collection.requester.address}
                      </p>
                    )}
                    <p className="card-text mb-1">
                      <strong>Local:</strong> Lat:{" "}
                      {collection.latitude.toFixed(4)}, Lon:{" "}
                      {collection.longitude.toFixed(4)}
                    </p>
                    {collection.notes && (
                      <p className="card-text mb-1">
                        <strong>Notas:</strong> {collection.notes}
                      </p>
                    )}
                    {collection.weightKg !== null &&
                      collection.weightKg !== undefined && (
                        <p className="card-text mb-1">
                          <strong>Peso (kg):</strong> {collection.weightKg}
                        </p>
                      )}
                    <div className="mt-3 d-grid gap-2">
                      {collection.status === "SCHEDULED" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(collection.id, "IN_ROUTE")
                          }
                          className="btn btn-warning btn-sm"
                        >
                          Pegar Coleta (Em Rota)
                        </button>
                      )}
                      {collection.status === "IN_ROUTE" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(collection.id, "COMPLETED")
                          }
                          className="btn btn-success btn-sm"
                        >
                          Concluir Coleta
                        </button>
                      )}
                      {collection.status !== "CANCELED" &&
                        (collection.status === "SCHEDULED" ||
                          collection.status === "IN_ROUTE") && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(collection.id, "CANCELED")
                            }
                            className="btn btn-danger btn-sm"
                          >
                            Cancelar
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
