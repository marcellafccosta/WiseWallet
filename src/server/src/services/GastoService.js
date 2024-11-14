import { prismaClient } from "../database/prismaClient.js";

export class GastoService {
    async getAll() {
        try {
            return await prismaClient.gasto.findMany({
                include: { categoria: true }
            });
        } catch (error) {
            throw new Error("Erro ao buscar gastos: " + error.message);
        }
    }

    async getById(id) {
        try {
            const gasto = await prismaClient.gasto.findUnique({
                where: { id: parseInt(id) },
                include: { categoria: true }
            });
            if (!gasto) throw new Error("Gasto não encontrado");
            return gasto;
        } catch (error) {
            throw new Error("Erro ao buscar gasto: " + error.message);
        }
    }

    async createGasto(gastoData) {
        try {
            return await prismaClient.gasto.create({
                data: {
                    rotulo: gastoData.rotulo,
                    quantia: gastoData.quantia,
                    data: new Date(gastoData.data),
                    parcelas: gastoData.parcelas,
                    formato: gastoData.formato,
                    categoria: { connect: { id: gastoData.categoriaId } }
                }
            });
        } catch (error) {
            throw new Error("Erro ao criar gasto: " + error.message);
        }
    }

    async updateGasto(id, gastoData) {
        try {
            const gastoExistente = await prismaClient.gasto.findUnique({
                where: { id: parseInt(id) }
            });
            if (!gastoExistente) throw new Error("Gasto não encontrado");

            return await prismaClient.gasto.update({
                where: { id: parseInt(id) },
                data: {
                    rotulo: gastoData.rotulo || gastoExistente.rotulo,
                    quantia: gastoData.quantia || gastoExistente.quantia,
                    data: gastoData.data ? new Date(gastoData.data) : gastoExistente.data,
                    parcelas: gastoData.parcelas || gastoExistente.parcelas,
                    formato: gastoData.formato || gastoExistente.formato,
                    categoria: gastoData.categoriaId
                        ? { connect: { id: gastoData.categoriaId } }
                        : undefined
                }
            });
        } catch (error) {
            throw new Error("Erro ao atualizar gasto: " + error.message);
        }
    }

    async deleteGasto(id) {
        try {
            const gasto = await prismaClient.gasto.findUnique({ where: { id: parseInt(id) } });
            if (!gasto) throw new Error("Gasto não encontrado");

            return await prismaClient.gasto.delete({ where: { id: parseInt(id) } });
        } catch (error) {
            throw new Error("Erro ao deletar gasto: " + error.message);
        }
    }
}

export default new GastoService();
