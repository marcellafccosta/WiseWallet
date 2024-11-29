import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const ModalGasto = ({ isModalOpen, setIsModalOpen, onGastoCreated }) => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategories(response.data);
      } catch (error) {
        message.error('Erro ao carregar as categorias');
      }
    };
    fetchCategorias();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Obtendo o id do usuário diretamente do localStorage
      const usuarioId = localStorage.getItem('idusuario');
      
      // Verificar se o idUsuario foi encontrado no localStorage
      if (!usuarioId) {
        message.error('Usuário não encontrado no localStorage');
        return;
      }

      // Garantir que o usuarioId seja um número
      const parsedUsuarioId = parseInt(usuarioId, 10);
      if (isNaN(parsedUsuarioId)) {
        message.error('ID do usuário inválido');
        return;
      }

      // Dados do gasto
      const gastoData = {
        ...values,
        data: moment(values.data).toISOString(), // Formatar a data para o formato correto
        usuarioId: parsedUsuarioId, // Usando o idUsuario obtido do localStorage
      };

      // Enviar o POST para criar o novo gasto
      await axios.post('http://localhost:3000/gastos', gastoData);

      message.success('Gasto criado com sucesso');
      setIsModalOpen(false);
      form.resetFields(); // Limpar os campos após o envio
      onGastoCreated(); // Callback para informar que o gasto foi criado
    } catch (error) {
      message.error('Erro ao criar o gasto');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Criar Novo Gasto"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose // Limpa os campos quando o modal fecha
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Rótulo"
          name="rotulo"
          rules={[{ required: true, message: 'Rótulo é obrigatório' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quantia"
          name="quantia"
          rules={[{ required: true, message: 'Quantia é obrigatória' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Data"
          name="data"
          rules={[{ required: true, message: 'Data é obrigatória' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Parcelas"
          name="parcelas"
          rules={[{ required: true, message: 'Parcelas é obrigatória' }]}
        >
          <InputNumber min={1} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Formato"
          name="formato"
          rules={[{ required: true, message: 'Formato é obrigatório' }]}
        >
          <Select>
            <Select.Option value="CREDITO">CREDITO</Select.Option>
            <Select.Option value="DEBITO">DEBITO</Select.Option>
            <Select.Option value="BOLETO">BOLETO</Select.Option>
            <Select.Option value="PIX">PIX</Select.Option>
            <Select.Option value="DINHEIRO">DINHEIRO</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Categoria"
          name="categoriaId"
          rules={[{ required: true, message: 'Categoria é obrigatória' }]}
        >
          <Select>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.nome}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalGasto;
