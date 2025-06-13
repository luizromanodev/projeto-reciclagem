import { Request, Response } from "express";
import CollectionService from "../services/CollectionService";
import { CollectionStatus } from "@prisma/client";
import { z } from "zod";

class CollectionController {
  private static scheduleCollectionSchema = z
    .object({
      latitude: z.number().min(-90).max(90, "Latitude inválida."),
      longitude: z.number().min(-180).max(180, "Longitude inválida."),
      pickupDate: z
        .string()
        .datetime("Formato de data e hora inválido (ISO 8601 esperado).")
        .transform((str) => new Date(str)),
      materials: z
        .array(
          z
            .object({
              materialId: z.string().uuid("ID do material inválido."),
              quantity: z.string().optional(),
            })
            .strict("Campos adicionais não são permitidos para materiais.")
        )
        .min(1, "Pelo menos um material deve ser especificado."),
      notes: z.string().optional(),
    })
    .strict("Campos adicionais não são permitidos no agendamento de coleta.");

  private static updateCollectionStatusSchema = z
    .object({
      status: z.nativeEnum(CollectionStatus, {
        message: "Status de coleta inválido.",
      }),
      cooperativeId: z.string().uuid("ID da cooperativa inválido.").optional(), // Para atribuir a coleta
      weightKg: z
        .number()
        .min(0, "O peso deve ser um número positivo.")
        .optional(), // Para quando a coleta é concluída
    })
    .strict("Campos adicionais não são permitidos na atualização de status.");

  scheduleCollection = async (req: Request, res: Response) => {
    try {
      // O ID do usuário solicitante vem do middleware de autenticação
      const requesterId = req.userId;
      if (!requesterId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      const validatedData = CollectionController.scheduleCollectionSchema.parse(
        req.body
      );
      const { latitude, longitude, pickupDate, materials, notes } =
        validatedData;

      const newCollection = await CollectionService.scheduleCollection(
        requesterId,
        latitude,
        longitude,
        pickupDate,
        materials,
        notes
      );
      return res.status(201).json(newCollection);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Erro de validação.", errors: error.errors });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  listCollections = async (req: Request, res: Response) => {
    try {
      const { status, requesterId, cooperativeId } = req.query;

      let filter: any = {};
      if (req.userRole === "CITIZEN" || req.userRole === "COMPANY") {
        filter.requesterId = req.userId;
        filter.isRequester = true;
      } else if (req.userRole === "COOPERATIVE") {
        // Cooperativas podem ver suas coletas atribuídas ou todas agendadas
        if (cooperativeId) {
          // Se a cooperativa quer ver suas coletas específicas
          filter.cooperativeId = cooperativeId as string; // assume que a cooperativa passa o próprio ID
        } else if (status === CollectionStatus.SCHEDULED) {
          // Cooperativa quer ver coletas agendadas não atribuídas
          filter.status = CollectionStatus.SCHEDULED;
          filter.cooperativeId = null; // Filtra por coletas sem cooperativa atribuída
        }
      }

      if (
        status &&
        Object.values(CollectionStatus).includes(status as CollectionStatus)
      ) {
        filter.status = status as CollectionStatus;
      }

      const collections = await CollectionService.listCollections(filter);
      return res.status(200).json(collections);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Erro ao listar coletas.", error: error.message });
    }
  };

  getCollectionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const collection = await CollectionService.getCollectionById(id);
      if (req.userRole === "CITIZEN" || req.userRole === "COMPANY") {
        if (collection.requesterId !== req.userId) {
          return res
            .status(403)
            .json({ message: "Acesso negado a esta coleta." });
        }
      } else if (req.userRole === "COOPERATIVE") {
        if (
          collection.cooperativeId !== req.userId &&
          collection.status !== CollectionStatus.SCHEDULED
        ) {
          return res
            .status(403)
            .json({ message: "Acesso negado a esta coleta." });
        }
      }

      return res.status(200).json(collection);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  updateCollectionStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData =
        CollectionController.updateCollectionStatusSchema.parse(req.body);
      const { status, cooperativeId, weightKg } = validatedData;

      // Lógica de validação de permissão:
      // Apenas a cooperativa logada (req.userId) pode atribuir/atualizar status de uma coleta para si mesma
      // ou admins (se houvesse um papel admin).
      if (cooperativeId && req.userId !== cooperativeId) {
        return res.status(403).json({
          message:
            "Você não tem permissão para atribuir esta coleta a outra cooperativa.",
        });
      }
      if (req.userRole !== "COOPERATIVE") {
        return res.status(403).json({
          message: "Apenas cooperativas podem atualizar o status das coletas.",
        });
      }

      const updatedCollection = await CollectionService.updateCollectionStatus(
        id,
        status,
        cooperativeId || req.userId,
        weightKg
      );
      return res.status(200).json(updatedCollection);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Erro de validação.", errors: error.errors });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  seedMaterials = async (req: Request, res: Response) => {
    try {
      await CollectionService.seedMaterials();
      return res
        .status(200)
        .json({ message: "Materiais pré-populados com sucesso!" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao pré-popular materiais.",
        error: error.message,
      });
    }
  };
}

export default new CollectionController();
