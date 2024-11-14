import { Router } from "express";
import { GastoController } from "../controllers/gastoController.js";

const router = Router();
const gastoController = new GastoController();

// Rota para criar um novo gasto
router.post('/', (req, res) => gastoController.createGastoController(req, res));

// Rota para buscar todos os gastos
router.get('/', (req, res) => gastoController.getGastosController(req, res));

// Rota para buscar gasto por id
router.get('/:id', (req, res) => gastoController.getGastoController(req, res));

export { router as GastoRoutes };
