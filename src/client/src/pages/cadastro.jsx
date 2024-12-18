import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Cadastro.css"; 
import fotoCadastro from '../assets/orgg.jpg';

const CadastroUsuario = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/usuario", values);
      message.success("Usuário cadastrado com sucesso!");
      console.log(response.data);

      // Limpa os campos do formulário
      form.resetFields();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      message.error("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="Cadastro-container">
      <div className="Cadastro-image">
      <img src={fotoCadastro} alt="Cadastro" />
      </div>
      <Form
        className="cadastro-form"
        form={form}
        name="cadastroUsuario"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="cadastro-title">Cadastro de Usuário</h2>
        
        <Form.Item
          label="Nome"
          name="nome"
          rules={[
            { required: true, message: "Por favor, insira seu nome!" },
          ]}
        >
          <Input placeholder="Digite seu nome" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Por favor, insira seu email!" },
            { type: "email", message: "Insira um email válido!" },
          ]}
        >
          <Input placeholder="Digite seu email" />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="senha"
          rules={[
            { required: true, message: "Por favor, insira sua senha!" },
            { min: 6, message: "A senha deve ter pelo menos 6 caracteres!" },
          ]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cadastrar
          </Button>
          <div className="possuiConta">
            Já possui uma conta?{' '}
            <Button type="link" onClick={handleLoginClick}>
              Login
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CadastroUsuario;
