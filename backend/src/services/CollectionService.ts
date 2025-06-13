import prisma from "../utils/prisma";
import { CollectionStatus } from "@prisma/client";

class CollectionService {
  async scheduleCollection(
    requesterId: string,
    latitude: number,
    longitude: number,
    pickupDate: Date,
    materials: { materialId: string; quantity?: string }[],
    notes?: string
  ) {
    if (!materials || materials.length === 0) {
      throw new Error(
        "Pelo menos um material deve ser especificado para a coleta."
      );
    }

    const collection = await prisma.collection.create({
      data: {
        requesterId,
        latitude,
        longitude,
        pickupDate,
        notes,
        materials: {
          create: materials.map((m) => ({
            material: { connect: { id: m.materialId } },
            quantity: m.quantity,
          })),
        },
      },
      include: {
        materials: {
          include: {
            material: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
    return collection;
  }

  async listCollections(filter: {
    status?: CollectionStatus;
    requesterId?: string;
    cooperativeId?: string;
    isRequester?: boolean;
  }) {
    const whereClause: any = {};
    if (filter.status) {
      whereClause.status = filter.status;
    }
    if (filter.requesterId && filter.isRequester) {
      whereClause.requesterId = filter.requesterId;
    }
    if (filter.cooperativeId && !filter.isRequester) {
      whereClause.cooperativeId = filter.cooperativeId;
    }
    // Lógica para listar coletas agendadas sem atribuição (para cooperativas verem)
    if (
      filter.status === CollectionStatus.SCHEDULED &&
      filter.cooperativeId === null
    ) {
      whereClause.cooperativeId = null;
    }

    const collections = await prisma.collection.findMany({
      where: whereClause,
      include: {
        materials: {
          include: {
            material: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        cooperative: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return collections;
  }

  async getCollectionById(id: string) {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            material: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        cooperative: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
    if (!collection) {
      throw new Error("Coleta não encontrada.");
    }
    return collection;
  }

  async updateCollectionStatus(
    collectionId: string,
    status: CollectionStatus,
    cooperativeId?: string,
    weightKg?: number
  ) {
    const updateData: any = { status }; // Considerar tipar 'updateData' de forma mais específica

    if (cooperativeId) {
      updateData.cooperativeId = cooperativeId;
    }
    if (weightKg !== undefined) {
      updateData.weightKg = weightKg;
    }

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: updateData,
      include: {
        materials: { include: { material: true } },
        requester: { select: { id: true, name: true, email: true } },
        cooperative: { select: { id: true, name: true, email: true } },
      },
    });
    return updatedCollection;
  }

  async listMaterials() {
    const materials = await prisma.material.findMany({
      orderBy: { name: "asc" }, // Ordena por nome
    });
    return materials;
  }

  // Método para pré-popular alguns materiais no banco de dados
  async seedMaterials() {
    const materialsToCreate = [
      {
        name: "Papel",
        description: "Jornais, revistas, caixas de papelão limpas",
      },
      {
        name: "Plástico",
        description: "Garrafas PET, embalagens plásticas, sacolas",
      },
      {
        name: "Metal",
        description: "Latas de alumínio, latas de aço, ferragens",
      },
      { name: "Vidro", description: "Garrafas, potes de vidro (sem tampa)" },
      { name: "Orgânico", description: "Restos de alimentos, podas de jardim" },
      {
        name: "Eletrônico",
        description: "Celulares, computadores, pilhas, baterias",
      },
    ];

    for (const materialData of materialsToCreate) {
      // Usa upsert para criar o material se não existir, ou não fazer nada se já existir
      await prisma.material.upsert({
        where: { name: materialData.name }, // Condição para encontrar material existente
        update: {}, // Não atualiza nada se o material já existe (apenas garante que existe)
        create: materialData, // Cria se não encontrar
      });
    }
    console.log("Materiais base adicionados/atualizados no banco de dados.");
  }
}

export default new CollectionService();
