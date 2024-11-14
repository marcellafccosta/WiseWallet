import { Router } from "express";
import { GastoRoutes } from "../routes/GastoRoutes.js";
import { CategoriaRoutes } from "../routes/CategoriaRoutes.js";

const routes = Router();

routes.use('/gastos', GastoRoutes);
routes.use('/categorias', CategoriaRoutes);

export default routes;