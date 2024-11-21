import { prismaClient } from "../database/prismaClient.js";

export class RelatorioService {
    async getGastosPorCategoria() {
        try {
            const gastosPorCategoria = await prismaClient.gasto.groupBy({
                by: ['categoriaId'],
                _sum: {
                    quantia: true
                }
            });
            return gastosPorCategoria.map(item => ({
                categoria: item.categoriaId,
                total: item._sum.quantia,
            }));
        } catch (error) {
            console.error('Erro ao buscar gastos por categoria:', error);
            throw new Error('Erro ao buscar gastos por categoria.');
        }
    }


    async getGastosPorMes() {
        try {
            const meses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
    
            const gastos = await prismaClient.gasto.findMany({
                select: {
                    data: true,
                    quantia: true,
                },
            });
    
            const gastosPorMes = gastos.reduce((acc, gasto) => {
                const mes = new Date(gasto.data).getUTCMonth(); // Retorna índice 0-11
                if (!acc[mes]) acc[mes] = 0;
                acc[mes] += gasto.quantia;
                return acc;
            }, {});
    
            return Object.entries(gastosPorMes).map(([mes, total]) => ({
                mes: meses[parseInt(mes, 10)], // Mapeia o índice para o nome do mês
                total,
            }));
        } catch (error) {
            console.error('Erro ao buscar gastos por mês:', error);
            throw new Error('Erro ao buscar gastos por mês.');
        }
    }
    
    async getGastosPorAno() {
        try {
            const gastos = await prismaClient.gasto.findMany({
                select: {
                    data: true,
                    quantia: true,
                },
            });


            const gastosPorAno = gastos.reduce((acc, gasto) => {
                const ano = new Date(gasto.data).getUTCFullYear();
                if (!acc[ano]) acc[ano] = 0;
                acc[ano] += gasto.quantia;
                return acc;
            }, {});


            return Object.entries(gastosPorAno).map(([ano, total]) => ({
                ano,
                total,
            }));
        } catch (error) {
            console.error("Erro ao buscar gastos por ano:", error);
            throw new Error("Erro ao buscar gastos por ano.");
        }
    }
}

export default new RelatorioService();