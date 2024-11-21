import { Router } from "express";
import RelatorioController from "../controllers/RelatorioController.js";

const router = Router();
const relatorioController = new RelatorioController();

router.get('/categoria', (req, res) => relatorioController.getGastosPorCategoria(req, res));
router.get('/mes', (req, res) => relatorioController.getGastosPorMes(req, res));
router.get('/ano', (req, res) => relatorioController.getGastoPorAno(req, res));
router.get('/formato', (req, res) => relatorioController.getGastsoPorFormato(req, res));

export { router as RelatorioRoutes}