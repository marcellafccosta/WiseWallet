import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar um novo gasto
export const createGasto = async (rotulo, quantia, data, parcelas, formato, categoriaId) => {
  try {
    const gasto = await prisma.gasto.create({
      data: {
        rotulo,
        quantia,
        data,
        parcelas,
        formato,
        categoriaId,
      },
    });
    return gasto;
  } catch (error) {
    throw new Error("Erro ao criar gasto: " + error.message);
  }
};

// Buscar todos os gastos
export const getAllGastos = async () => {
  try {
    const gastos = await prisma.gasto.findMany({
      include: {
        categoria: true,
      },
    });
    return gastos;
  } catch (error) {
    throw new Error("Erro ao buscar gastos: " + error.message);
  }
};

// Buscar gasto por id
export const getGastoById = async (id) => {
  try {
    const gasto = await prisma.gasto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });
    return gasto;
  } catch (error) {
    throw new Error("Erro ao buscar gasto: " + error.message);
  }
};
