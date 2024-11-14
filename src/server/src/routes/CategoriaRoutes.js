// src/routes/CategoriaRoutes.js
import { Router } from "express";
import categoriaController from "../controllers/CategoriaController.js";  // Importa como instância

const router = Router();

// Definindo rotas para Categoria
router.get('/', (req, res) => categoriaController.getAll(req, res));
router.get('/:id', (req, res) => categoriaController.getById(req, res));
router.post('/', (req, res) => categoriaController.createCategoria(req, res));
router.put('/:id', (req, res) => categoriaController.updateCategoria(req, res));
router.delete('/:id', (req, res) => categoriaController.deleteCategoria(req, res));

export { router as CategoriaRoutes };
