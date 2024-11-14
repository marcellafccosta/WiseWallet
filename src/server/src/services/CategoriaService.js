import { prismaClient } from "../database/prismaClient.js";

export class CategoriaService {
    async getAll() {
        try {
            return await prismaClient.categoria.findMany({
                include: {
                    gastos: true
                }
            });
        } catch (error) {
            throw new Error("Erro ao buscar categorias: " + error.message);
        }
    }

    async getById(id) {
        try {
            const categoria = await prismaClient.categoria.findUnique({
                where: { id: parseInt(id) },
                include: {
                    gastos: true
                }
            });
            return categoria;
        } catch (error) {
            throw new Error("Erro ao buscar categoria por ID: " + error.message);
        }
    }

    async createCategoria(categoriaData) {
        try {
            return await prismaClient.categoria.create({
                data: categoriaData
            });
        } catch (error) {
            throw new Error("Erro ao criar categoria: " + error.message);
        }
    }

    async updateCategoria(id, categoriaData) {
        try {
            return await prismaClient.categoria.update({
                where: { id: parseInt(id) },
                data: categoriaData
            });
        } catch (error) {
            throw new Error("Erro ao atualizar categoria: " + error.message);
        }
    }

    async deleteCategoria(id) {
        try {
            return await prismaClient.categoria.delete({
                where: { id: parseInt(id) }
            });
        } catch (error) {
            throw new Error("Erro ao deletar categoria: " + error.message);
        }
    }
}

export default new CategoriaService();
