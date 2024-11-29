-- CreateEnum
CREATE TYPE "Formato" AS ENUM ('CREDITO', 'DEBITO', 'BOLETO', 'PIX', 'DINHEIRO');

-- CreateTable
CREATE TABLE "Gasto" (
    "id" SERIAL NOT NULL,
    "rotulo" TEXT NOT NULL,
    "quantia" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "parcelas" INTEGER NOT NULL,
    "formato" "Formato" NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idusuario" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idusuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;
