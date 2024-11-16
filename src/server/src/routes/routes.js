import { Router } from "express";
import { GastoRoutes } from "../routes/GastoRoutes.js";
import { CategoriaRoutes } from "../routes/CategoriaRoutes.js";
import { UsuarioRoutes } from "../routes/UsuarioRoutes.js";

const routes = Router();

routes.use('/gastos', GastoRoutes);
routes.use('/categorias', CategoriaRoutes);
routes.use('/usuario', UsuarioRoutes);

export default routes;