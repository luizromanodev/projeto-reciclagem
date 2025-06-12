"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionService_1 = __importDefault(require("../services/CollectionService"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
class CollectionController {
    constructor() {
        Object.defineProperty(this, "scheduleCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                // Mude para arrow function
                try {
                    // O ID do usuário solicitante vem do middleware de autenticação
                    const requesterId = req.userId;
                    if (!requesterId) {
                        return res.status(401).json({ message: "Usuário não autenticado." });
                    }
                    // Acesse o schema usando CollectionController.scheduleCollectionSchema
                    const validatedData = CollectionController.scheduleCollectionSchema.parse(req.body);
                    const { latitude, longitude, pickupDate, materials, notes } = validatedData;
                    const newCollection = await CollectionService_1.default.scheduleCollection(requesterId, latitude, longitude, pickupDate, materials, notes);
                    return res.status(201).json(newCollection);
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        return res
                            .status(400)
                            .json({ message: "Erro de validação.", errors: error.errors });
                    }
                    return res.status(400).json({ message: error.message });
                }
            }
        });
        Object.defineProperty(this, "listCollections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                // Mude para arrow function
                try {
                    const { status, requesterId, cooperativeId } = req.query;
                    let filter = {};
                    if (req.userRole === "CITIZEN" || req.userRole === "COMPANY") {
                        filter.requesterId = req.userId;
                        filter.isRequester = true;
                    }
                    else if (req.userRole === "COOPERATIVE") {
                        // Cooperativas podem ver suas coletas atribuídas ou todas agendadas
                        if (cooperativeId) {
                            // Se a cooperativa quer ver suas coletas específicas
                            filter.cooperativeId = cooperativeId; // assume que a cooperativa passa o próprio ID
                        }
                        else if (status === client_1.CollectionStatus.SCHEDULED) {
                            // Cooperativa quer ver coletas agendadas não atribuídas
                            filter.status = client_1.CollectionStatus.SCHEDULED;
                            filter.cooperativeId = null; // Filtra por coletas sem cooperativa atribuída
                        }
                    }
                    if (status &&
                        Object.values(client_1.CollectionStatus).includes(status)) {
                        filter.status = status;
                    }
                    const collections = await CollectionService_1.default.listCollections(filter);
                    return res.status(200).json(collections);
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({ message: "Erro ao listar coletas.", error: error.message });
                }
            }
        });
        Object.defineProperty(this, "getCollectionById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                // Mude para arrow function
                try {
                    const { id } = req.params;
                    const collection = await CollectionService_1.default.getCollectionById(id);
                    // Opcional: Adicionar lógica para garantir que o usuário só veja suas próprias coletas
                    // ou coletas que ele está autorizado a ver (se for cooperativa atribuída)
                    if (req.userRole === "CITIZEN" || req.userRole === "COMPANY") {
                        if (collection.requesterId !== req.userId) {
                            return res
                                .status(403)
                                .json({ message: "Acesso negado a esta coleta." });
                        }
                    }
                    else if (req.userRole === "COOPERATIVE") {
                        if (collection.cooperativeId !== req.userId &&
                            collection.status !== client_1.CollectionStatus.SCHEDULED) {
                            return res
                                .status(403)
                                .json({ message: "Acesso negado a esta coleta." });
                        }
                    }
                    return res.status(200).json(collection);
                }
                catch (error) {
                    return res.status(404).json({ message: error.message });
                }
            }
        });
        Object.defineProperty(this, "updateCollectionStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                // Mude para arrow function
                try {
                    const { id } = req.params;
                    // Acesse o schema usando CollectionController.updateCollectionStatusSchema
                    const validatedData = CollectionController.updateCollectionStatusSchema.parse(req.body);
                    const { status, cooperativeId, weightKg } = validatedData;
                    // Lógica de validação de permissão:
                    // Apenas a cooperativa logada (req.userId) pode atribuir/atualizar status de uma coleta para si mesma
                    // ou admins (se houvesse um papel admin).
                    if (cooperativeId && req.userId !== cooperativeId) {
                        return res
                            .status(403)
                            .json({
                            message: "Você não tem permissão para atribuir esta coleta a outra cooperativa.",
                        });
                    }
                    if (req.userRole !== "COOPERATIVE") {
                        return res
                            .status(403)
                            .json({
                            message: "Apenas cooperativas podem atualizar o status das coletas.",
                        });
                    }
                    const updatedCollection = await CollectionService_1.default.updateCollectionStatus(id, status, cooperativeId || req.userId, weightKg);
                    return res.status(200).json(updatedCollection);
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        return res
                            .status(400)
                            .json({ message: "Erro de validação.", errors: error.errors });
                    }
                    return res.status(400).json({ message: error.message });
                }
            }
        });
        Object.defineProperty(this, "seedMaterials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                // Mude para arrow function
                try {
                    await CollectionService_1.default.seedMaterials();
                    return res
                        .status(200)
                        .json({ message: "Materiais pré-populados com sucesso!" });
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({
                        message: "Erro ao pré-popular materiais.",
                        error: error.message,
                    });
                }
            }
        });
    }
}
// Mova os schemas para dentro da classe como propriedades estáticas
Object.defineProperty(CollectionController, "scheduleCollectionSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: zod_1.z
        .object({
        latitude: zod_1.z.number().min(-90).max(90, "Latitude inválida."),
        longitude: zod_1.z.number().min(-180).max(180, "Longitude inválida."),
        pickupDate: zod_1.z
            .string()
            .datetime("Formato de data e hora inválido (ISO 8601 esperado).")
            .transform((str) => new Date(str)), // Transforma string em Date
        materials: zod_1.z
            .array(zod_1.z
            .object({
            materialId: zod_1.z.string().uuid("ID do material inválido."),
            quantity: zod_1.z.string().optional(),
        })
            .strict("Campos adicionais não são permitidos para materiais."))
            .min(1, "Pelo menos um material deve ser especificado."),
        notes: zod_1.z.string().optional(),
    })
        .strict("Campos adicionais não são permitidos no agendamento de coleta.")
});
Object.defineProperty(CollectionController, "updateCollectionStatusSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: zod_1.z
        .object({
        status: zod_1.z.nativeEnum(client_1.CollectionStatus, {
            message: "Status de coleta inválido.",
        }),
        cooperativeId: zod_1.z.string().uuid("ID da cooperativa inválido.").optional(), // Para atribuir a coleta
        weightKg: zod_1.z
            .number()
            .min(0, "O peso deve ser um número positivo.")
            .optional(), // Para quando a coleta é concluída
    })
        .strict("Campos adicionais não são permitidos na atualização de status.")
});
exports.default = new CollectionController();
