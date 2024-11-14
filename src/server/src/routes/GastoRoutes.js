import { Router } from "express";
import GastoController from "../controllers/GastoController.js";

const router = Router();
const gastoController = new GastoController(); // Create an instance of GastoController

// Define the CRUD routes
router.get('/', (req, res) => gastoController.getAll(req, res));
router.get('/:id', (req, res) => gastoController.getById(req, res));
router.post('/', (req, res) => gastoController.createGasto(req, res));
router.put('/:id', (req, res) => gastoController.updateGasto(req, res));
router.delete('/:id', (req, res) => gastoController.deleteGasto(req, res));

export { router as GastoRoutes };
