import { Router } from "express";
import { GastoRoutes } from "../routes/GastoRoutes.js";
import { CategoriaRoutes } from "../routes/CategoriaRoutes.js";
import { UsuarioRoutes } from "../routes/UsuarioRoutes.js";
import { RelatorioRoutes } from "./RelatorioRoutes.js";

const routes = Router();

routes.use('/gastos', GastoRoutes);
routes.use('/categorias', CategoriaRoutes);
routes.use('/usuario', UsuarioRoutes);
routes.use('/relatorio', RelatorioRoutes);

export default routes;