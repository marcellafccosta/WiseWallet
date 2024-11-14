import { Router } from "express";
import { CategoriaController } from "../controllers/categoriaController.js";

const router = Router();
const categoriaController = new CategoriaController();

router.post('/', (req, res) => categoriaController.createCategoriaController(req, res));

router.get('/', (req, res) => categoriaController.getCategoriasController(req, res));

router.get('/:id', (req, res) => categoriaController.getCategoriaController(req, res));

export { router as CategoriaRoutes };
