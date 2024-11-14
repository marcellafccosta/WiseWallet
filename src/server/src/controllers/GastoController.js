import { createGasto, getAllGastos, getGastoById } from "../services/gastoService.js";

export class GastoController {
  // Controller to create a new gasto
  async createGastoController(req, res) {
    const { rotulo, quantia, data, parcelas, formato, categoriaId } = req.body;
    try {
      const gasto = await createGasto(rotulo, quantia, new Date(data), parcelas, formato, categoriaId);
      res.status(201).json(gasto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get all gastos
  async getGastosController(req, res) {
    try {
      const gastos = await getAllGastos();
      res.status(200).json(gastos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get gasto by id
  async getGastoController(req, res) {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const gasto = await getGastoById(Number(id));
      if (gasto) {
        res.status(200).json(gasto);
      } else {
        res.status(404).json({ error: "Gasto não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
