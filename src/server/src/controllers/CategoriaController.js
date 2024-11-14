import { createCategoria, getAllCategorias, getCategoriaById } from "../services/CategoriaService";

export class CategoriaController {
  async createCategoriaController(req, res) {
    const { nome } = req.body;
    try {
      const categoria = await createCategoria(nome);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoriasController(req, res) {
    try {
      const categorias = await getAllCategorias();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoriaController(req, res) {
    const { id } = req.params;
    try {
      const categoria = await getCategoriaById(Number(id));
      if (categoria) {
        res.status(200).json(categoria);
      } else {
        res.status(404).json({ error: "Categoria não encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
