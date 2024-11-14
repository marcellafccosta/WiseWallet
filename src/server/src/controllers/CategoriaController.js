// src/controllers/CategoriaController.js
import CategoriaService from "../services/CategoriaService.js";

export class CategoriaController {
    async getAll(req, res) {
        try {
            const categorias = await CategoriaService.getAll();
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const categoria = await CategoriaService.getById(id);
            if (categoria) {
                res.status(200).json(categoria);
            } else {
                res.status(404).json({ message: "Categoria não encontrada." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createCategoria(req, res) {
        try {
            const novaCategoria = await CategoriaService.createCategoria(req.body);
            res.status(201).json(novaCategoria);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCategoria(req, res) {
        const { id } = req.params;
        try {
            const categoriaAtualizada = await CategoriaService.updateCategoria(id, req.body);
            if (categoriaAtualizada) {
                res.status(200).json(categoriaAtualizada);
            } else {
                res.status(404).json({ message: "Categoria não encontrada." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCategoria(req, res) {
        const { id } = req.params;
        try {
            const categoriaDeletada = await CategoriaService.deleteCategoria(id);
            if (categoriaDeletada) {
                res.status(200).json({ message: "Categoria deletada com sucesso." });
            } else {
                res.status(404).json({ message: "Categoria não encontrada." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

// Exporta como instância da classe
export default new CategoriaController();
