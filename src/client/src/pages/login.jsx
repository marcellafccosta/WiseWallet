import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd'; 
import "../style/Login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import fotoLogin from '../assets/org.jpg';

const Login = () => {
  const navigate = useNavigate(); 

  const onFinish = async (values) => {
    try {
      console.log('Valores recebidos do formulário: ', values);

      const response = await axios.post('http://localhost:3000/usuario/login', {
        email: values.email,
        senha: values.senha,
      });

      console.log('Resposta da API:', response.data);

      const { token, usuario } = response.data; 

      if (usuario && usuario.idusuario) {
        localStorage.setItem('idusuario', usuario.idusuario);
        message.success(`Bem-vindo, ${usuario.nome}!`);
        navigate(`/perfil`);
      } else {
        message.error("ID do usuário não encontrado na resposta.");
        return;
      } 

      localStorage.setItem('token', token); 

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      message.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleCadastroClick = () => {
    navigate('/cadastro');
  };

  return (
    <div className="Login-container">
  <div className="Login-image">
    <img src={fotoLogin} alt="Login" />
  </div>

  <Form
    className="login-form"
    name="login"
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
  >
    <h2>Login</h2>
    <Form.Item
      name="email"
      rules={[
        {
          required: true,
          message: 'Por favor, insira seu email!',
        },
      ]}
    >
      <Input prefix={<UserOutlined />} placeholder="E-mail" />
    </Form.Item>

    <Form.Item
      name="senha"
      rules={[
        {
          required: true,
          message: 'Por favor, insira sua senha!',
        },
      ]}
    >
      <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
        Entrar
      </Button>
      <div className="possuiConta">
        Ainda não possui uma conta?{' '}
        <Button type="link" onClick={handleCadastroClick}>
          Cadastre-se!
        </Button>
      </div>
    </Form.Item>
  </Form>
</div>

  );
};

export default Login;
