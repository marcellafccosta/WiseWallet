import { prismaClient } from "../database/prismaClient.js";
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export class UsuarioService{
    async createUser(userData){
        try{
            if(!userData.nome || !userData.email || !userData.senha){
                throw new Error("Dados incompletos")
            }
            const senhaCriptografada = await bcrypt.hash(userData.senha, SALT_ROUNDS);

            const usuario = await prismaClient.usuario.create({
                data: {
                    nome : userData.nome, 
                    email: userData.email,
                    senha: senhaCriptografada
                }
            })

            return usuario;
        } catch(error){
            throw new Error("Erro ao cadastrar usuario" + error.message)
        }
    }

    async updateUser(userId, { nome, email, senhaAtual, senhaNova }) {
        try {
            // Buscar o usuário pelo ID
            const usuario = await prismaClient.usuario.findUnique({
                where: { idusuario: parseInt(userId) }
            });
    
            if (!usuario) {
                throw new Error("Usuário não encontrado.");
            }
    
            const updateData = {};
    
            // Verificar se o nome precisa ser atualizado
            if (nome) {
                updateData.nome = nome;
            }
    
            // Verificar se o email precisa ser atualizado
            if (email) {
                updateData.email = email;
            }
    
            // Verificar e atualizar a senha, se fornecida
            if (senhaAtual && senhaNova) {
                const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
                if (!senhaValida) {
                    throw new Error("Senha atual está incorreta.");
                }
    
                // Criptografar a nova senha
                const senhaCriptografada = await bcrypt.hash(senhaNova, SALT_ROUNDS);
                updateData.senha = senhaCriptografada;
            }
    
            // Atualizar os dados no banco de dados
            const usuarioAtualizado = await prismaClient.usuario.update({
                where: { idusuario: parseInt(userId) },
                data: updateData
            });
    
            return usuarioAtualizado;
        } catch (error) {
            throw new Error("Erro ao atualizar os dados: " + error.message);
        }
    }
    
    

    async deleteUser(id) {
        try {
            const usuarioDeletado = await prismaClient.usuario.delete({
                where: {
                    idusuario: parseInt(id)
                },
            });
            if (!usuarioDeletado) throw new Error("Usuário não encontrado");
            return usuarioDeletado;
        } catch (error) {
            throw new Error("Erro ao deletar usuário: " + error.message);
        }
    }

    async getAll() {
        try {
            const usuarios = await prismaClient.usuario.findMany();
            return usuarios;
        } catch (error) {
            throw new Error("Erro ao buscar usuários: " + error.message);
        }
    }

    async getById(id) {
        try {
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    idusuario: parseInt(id),
                },
            });

            if (!usuario) {
                throw new Error("Usuário não encontrado");
            }

            return usuario;
        } catch (error) {
            throw new Error("Erro ao buscar usuário por ID: " + error.message);
        }
    }
}

export default new UsuarioService();