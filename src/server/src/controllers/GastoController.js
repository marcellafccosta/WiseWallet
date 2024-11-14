import GastoService from "../services/GastoService.js";

class GastoController {
    async getAll(req, res) {
        try {
            const gastos = await GastoService.getAll();
            res.status(200).json(gastos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const gasto = await GastoService.getById(id);
            if (!gasto) {
                return res.status(404).json({ message: "Gasto não encontrado" });
            }
            res.status(200).json(gasto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createGasto(req, res) {
        try {
            const gastoData = req.body;
            const novoGasto = await GastoService.createGasto(gastoData);
            res.status(201).json(novoGasto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateGasto(req, res) {
        const { id } = req.params;
        const gastoData = req.body;
        try {
            const gastoAtualizado = await GastoService.updateGasto(id, gastoData);
            if (gastoAtualizado) {
                res.status(200).json(gastoAtualizado);
            } else {
                res.status(404).json({ message: "Gasto não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteGasto(req, res) {
        const { id } = req.params;
        try {
            const gastoDeletado = await GastoService.deleteGasto(id);
            if (gastoDeletado) {
                res.status(200).json(gastoDeletado);
            } else {
                res.status(404).json({ message: "Gasto não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default GastoController;
