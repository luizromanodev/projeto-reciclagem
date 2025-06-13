// backend/src/controllers/MaterialController.ts
import { Request, Response } from "express";
import CollectionService from "../services/CollectionService";

class MaterialController {
  listMaterials = async (req: Request, res: Response) => {
    try {
      const materials = await CollectionService.listMaterials();
      return res.status(200).json(materials);
    } catch (error: any) {
      console.error("Erro ao listar materiais:", error);
      return res
        .status(500)
        .json({ message: "Erro interno ao carregar materiais." });
    }
  };
}
export default new MaterialController();
