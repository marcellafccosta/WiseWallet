import UsuarioService from '../services/UsuarioService.js';
import { prismaClient } from "../database/prismaClient.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UsuarioController{

    async createUser(req, res) {
        try {
            const userData = req.body;
            console.log('Dados recebidos para criação:', userData);

            const novoUsuario = await UsuarioService.createUser(userData);
            return res.status(201).json(novoUsuario);

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                message: 'Não foi possível criar o usuário. Verifique os dados fornecidos e tente novamente.',
                error: error.message
            });
        }
    }
    async getAll(req, res) {
        try {
            const usuarios = await UsuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({
                message: 'Não foi possível recuperar os usuários. Tente novamente mais tarde.',
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params; 
            const usuario = await UsuarioService.getById(id); 

            return res.status(200).json(usuario); 
        } catch (error) {
            return res.status(404).json({ error: error.message }); 
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await UsuarioService.updateUser(id, userData);

            if (updatedUser) {
                return res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuario: updatedUser });
            } else {
                return res.status(404).json({ message: `Usuário com ID ${id} não encontrado.` });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Não foi possível atualizar o usuário. Verifique os dados e tente novamente.',
                error: error.message
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await UsuarioService.deleteUser(id);

            if (deletedUser) {
                return res.status(204).send(); // 204 No Content não precisa de corpo na resposta
            } else {
                return res.status(404).json({ message: `Usuário com ID ${id} não encontrado para exclusão.` });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Não foi possível deletar o usuário. Verifique o ID e tente novamente.',
                error: error.message
            });
        }
    }

    async loginUser(req, res) {
        try {
          const { email, senha } = req.body;
      
          const usuario = await prismaClient.usuario.findUnique({
            where: { email }
          });
      
          if (!usuario) {
            return res.status(401).json({ message: 'Usuário não encontrado!' });
          }
      
          const senhaValida = await bcrypt.compare(senha, usuario.senha);
          if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta!' });
          }
      
          const token = jwt.sign({ idusuario: usuario.idusuario }, 'wisewallet', { expiresIn: '1h' });
      
          return res.status(200).json({
            token,
            usuario: {
              idusuario: usuario.idusuario,
              nome: usuario.nome,
              email: usuario.email,
            }
          });
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          return res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
        }
      }


}