import RelatorioService from "../services/RelatorioService.js";


class RelatorioController {
    async getGastosPorCategoria(req, res) {
        try {
            const gastosPorCategoria = await RelatorioService.getGastosPorCategoria();
            res.status(200).json(gastosPorCategoria);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getGastosPorMes(req, res) {
        try {
            const gastosPorMes = await RelatorioService.getGastosPorMes();
            res.status(200).json(gastosPorMes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getGastoPorAno(req, res) {
        try {
            const gastosPorAno = await RelatorioService.getGastosPorAno();
            res.status(200).json(gastosPorAno);
        } catch (error) {
            res.status(500).json({ error: error.message });
    }
}


    async getGastsoPorFormato(req, res) {
        try {
            const gastosPorFormato = await RelatorioService.getGastosPorFormato();
            res.status(200).json(gastosPorFormato);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default RelatorioController;