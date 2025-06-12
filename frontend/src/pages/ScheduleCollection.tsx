import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { isApiError } from "../utils/typeGuards";

// TIPAGENS ESPECÍFICAS DESTA PÁGINA
// AGORA UTILIZADA!
interface Material {
  id: string;
  name: string;
}

const ScheduleCollection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Use a interface Material para tipar o estado 'materials'
  const [materials, setMaterials] = useState<Material[]>([]); // <<< CORREÇÃO AQUI: Tipagem do estado
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [collectionQuantityNotes, setCollectionQuantityNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [collectionNotes, setCollectionNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Maringá central coordinates for map simulation
  const MARINGA_LATITUDE = -23.4251;
  const MARINGA_LONGITUDE = -51.9392;

  // Load materials from backend
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoadingMaterials(true);
        // Assumindo que você tem uma rota GET /api/materials agora
        // Esta rota pode precisar de um token de cooperativa no backend, ou ser pública
        const response = await api.get<Material[]>("/api/materials", {
          // <<< CORREÇÃO AQUI: Tipagem da resposta da API
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("cooperativeToken") || ""
            }`,
          },
        });
        setMaterials(response.data);
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(
            err.response?.data?.message || "Erro ao carregar materiais."
          );
        } else {
          setError("Ocorreu um erro desconhecido ao carregar materiais.");
        }
        console.error("Erro ao carregar materiais:", err);
        // Fallback para demo se API falhar ou rota não existir
        setMaterials([
          { id: "mat-plastico-demo-id", name: "Plástico" },
          { id: "mat-papel-demo-id", name: "Papel" },
          { id: "mat-metal-demo-id", name: "Metal" },
          { id: "mat-vidro-demo-id", name: "Vidro" },
        ]);
      } finally {
        setLoadingMaterials(false);
      }
    };
    loadMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações básicas
    if (!user) {
      setError("Usuário não autenticado. Faça login para agendar.");
      return;
    }
    if (!selectedMaterialId) {
      setError("Por favor, selecione um tipo de material.");
      return;
    }
    if (!collectionQuantityNotes.trim()) {
      setError("Por favor, insira a quantidade estimada do material.");
      return;
    }
    if (!pickupDate) {
      setError("Por favor, selecione a data e hora da coleta.");
      return;
    }

    try {
      // Usa latitude/longitude do usuário se disponível, caso contrário, usa Maringá central simulado
      const collectionLatitude =
        user.latitude || MARINGA_LATITUDE + (Math.random() * 0.01 - 0.005);
      const collectionLongitude =
        user.longitude || MARINGA_LONGITUDE + (Math.random() * 0.01 - 0.005);

      await api.post("/api/collections", {
        latitude: collectionLatitude,
        longitude: collectionLongitude,
        pickupDate: new Date(pickupDate).toISOString(), // Converte para formato ISO
        materials: [
          { materialId: selectedMaterialId, quantity: collectionQuantityNotes },
        ],
        notes: collectionNotes,
      });
      alert("Coleta agendada com sucesso!");
      navigate("/"); // Redireciona para a página inicial
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || "Erro ao agendar coleta.");
      } else {
        setError("Ocorreu um erro desconhecido ao agendar coleta.");
      }
      console.error("Erro ao agendar coleta:", err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "calc(100vh - 112px)" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="card-title text-center mb-4 text-success">
          Agendar Nova Coleta
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="materialTypeSelect" className="form-label">
              Tipo de Material:
            </label>
            {loadingMaterials ? (
              <p className="text-muted">Carregando materiais...</p>
            ) : (
              <select
                id="materialTypeSelect"
                className="form-select"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                required
              >
                <option value="">Selecione um material</option>
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="collectionQuantityNotes" className="form-label">
              Quantidade Estimada (Ex: "2 sacolas", "1 caixa"):
            </label>
            <input
              type="text"
              id="collectionQuantityNotes"
              className="form-control"
              value={collectionQuantityNotes}
              onChange={(e) => setCollectionQuantityNotes(e.target.value)}
              placeholder="Ex: 5kg, 2 sacolas"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pickupDate" className="form-label">
              Data e Hora da Coleta:
            </label>
            <input
              type="datetime-local"
              id="pickupDate"
              className="form-control"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="collectionNotes" className="form-label">
              Observações (opcional):
            </label>
            <textarea
              id="collectionNotes"
              className="form-control"
              value={collectionNotes}
              onChange={(e) => setCollectionNotes(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">
              Confirmar Agendamento
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-outline-secondary"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCollection;
