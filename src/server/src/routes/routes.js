import { Router } from "express";
import { GastoRoutes } from "./GastoRoutes.js";
import { CategoriaRoutes } from "./CategoriaRoutes.js";

const routes = Router();

// Usando as rotas de Gasto e Categoria
routes.use('/gastos', GastoRoutes);
routes.use('/categorias', CategoriaRoutes);

export default routes;
