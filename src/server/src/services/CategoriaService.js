import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar uma nova categoria
export const createCategoria = async (nome) => {
  try {
    const categoria = await prisma.categoria.create({
      data: { nome },
    });
    return categoria;
  } catch (error) {
    throw new Error("Erro ao criar categoria: " + error.message);
  }
};

// Buscar todas as categorias
export const getAllCategorias = async () => {
  try {
    const categorias = await prisma.categoria.findMany();
    return categorias;
  } catch (error) {
    throw new Error("Erro ao buscar categorias: " + error.message);
  }
};

// Buscar uma categoria pelo id
export const getCategoriaById = async (id) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });
    return categoria;
  } catch (error) {
    throw new Error("Erro ao buscar categoria: " + error.message);
  }
};
