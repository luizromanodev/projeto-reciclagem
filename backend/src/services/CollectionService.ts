import prisma from "../utils/prisma";
import { CollectionStatus } from "@prisma/client"; // Importa o enum de status

class CollectionService {
  async scheduleCollection(
    requesterId: string,
    latitude: number,
    longitude: number,
    pickupDate: Date,
    materials: { materialId: string; quantity?: string }[],
    notes?: string
  ) {
    // Validação básica: materiais devem existir e ter IDs válidos
    if (!materials || materials.length === 0) {
      throw new Error(
        "Pelo menos um material deve ser especificado para a coleta."
      );
    }

    // Opcional: Verificar se os materialId's existem na tabela Material
    // const existingMaterials = await prisma.material.findMany({
    //   where: { id: { in: materials.map(m => m.materialId) } }
    // });
    // if (existingMaterials.length !== materials.length) {
    //   throw new Error('Um ou mais materiais especificados são inválidos.');
    // }

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
            material: true, // Inclui os detalhes do material associado
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
      // Se for um cidadão/empresa vendo suas coletas
      whereClause.requesterId = filter.requesterId;
    }
    if (filter.cooperativeId && !filter.isRequester) {
      // Se for uma cooperativa vendo suas coletas atribuídas
      whereClause.cooperativeId = filter.cooperativeId;
    }
    // Para cooperativas vendo todas as coletas agendadas (sem atribuição ainda)
    if (filter.status === CollectionStatus.SCHEDULED && !filter.cooperativeId) {
      whereClause.cooperativeId = null; // Coletas que ainda não foram atribuídas
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
    const updateData: any = { status };

    if (cooperativeId) {
      updateData.cooperativeId = cooperativeId; // Atribui a coleta a uma cooperativa
    }
    if (weightKg !== undefined) {
      updateData.weightKg = weightKg; // Define o peso ao concluir a coleta
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

  // Serviço para pré-popular alguns materiais
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
      await prisma.material.upsert({
        where: { name: materialData.name },
        update: {},
        create: materialData,
      });
    }
    console.log("Materiais base adicionados/atualizados no banco de dados.");
  }
}

export default new CollectionService();
