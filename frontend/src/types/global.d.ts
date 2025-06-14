export interface ApiErrorResponse {
  message: string;
  errors?: string[]; // Se o seu backend retorna um array de mensagens de erro
  statusCode?: number; // Exemplo: se o backend retorna um statusCode no corpo
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CITIZEN" | "COMPANY" | "COOPERATIVE";
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  points?: number; // Para futura gamificação
}

// Interface para Material reciclável
export interface Material {
  id: string;
  name: string;
  description?: string; // Adicione se seu backend tiver esta propriedade
}

// Interface para Coleta
export interface Collection {
  id: string;
  requester: {
    name: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  materials: { material: { name: string; id: string }; quantity?: string }[];
  pickupDate: string; // Data e hora da coleta no formato ISO string
  status: "SCHEDULED" | "IN_ROUTE" | "COMPLETED" | "CANCELED";
  latitude: number;
  longitude: number;
  weightKg?: number; // Peso total em KG
  notes?: string;
  cooperativeId?: string | null; // ID da cooperativa atribuída (pode ser null)
  cooperative?: { name: string; email: string; id: string } | null; // Detalhes da cooperativa atribuída
}
