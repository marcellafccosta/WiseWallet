import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, message, Button, Popconfirm } from 'antd';
import axios from 'axios';
import AppHeader from '../components/Header';
import ModalGasto from '../components/modal'; // Certifique-se de importar o componente ModalGasto

const EditableContext = React.createContext(null);

// Função para célula editável
const EditableTable = ({ editable, children, ...restProps }) => (
  <td {...restProps}>
    {editable ? children : null}
  </td>
);

// Função para linha editável
const EditableRow = ({ title, editable, children, ...restProps }) => (
  <tr {...restProps}>
    {children}
  </tr>
);

const App = () => {
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a exibição do modal

  useEffect(() => {
    const storedId = localStorage.getItem('idusuario');
    if (storedId) {
      setIdUsuario(storedId);
    } else {
      message.error('Usuário não identificado. Faça login novamente.');
    }
  }, []);

  useEffect(() => {
    if (!idUsuario) return;

    const fetchGastos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gastos/usuario/${idUsuario}`);
        const formattedData = response.data.map((item) => ({
          key: item.id,
          rotulo: item.rotulo,
          quantia: item.quantia,
          data: item.data,
          parcelas: item.parcelas,
          formato: item.formato,
          categoria: item.categoriaId,
        }));
        setDataSource(formattedData);
      } catch (error) {
        message.error('Erro ao carregar os dados dos gastos');
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategories(response.data);
      } catch (error) {
        message.error('Erro ao carregar as categorias');
      }
    };

    fetchGastos();
    fetchCategorias();
  }, [idUsuario]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/gastos/${id}`);
      const newData = dataSource.filter((item) => item.key !== id);
      setDataSource(newData);
      message.success('Gasto deletado com sucesso');
    } catch (error) {
      message.error('Erro ao deletar o gasto');
    }
  };

  const handleSave = async (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);

    try {
      await axios.put(`http://localhost:3000/gastos/${row.key}`, row);
      message.success('Gasto atualizado com sucesso');
    } catch (error) {
      message.error('Erro ao atualizar o gasto');
    }
  };

  const columns = [
    {
      title: 'Rotulo',
      dataIndex: 'rotulo',
      editable: true,
      sorter: (a, b) => a.rotulo.localeCompare(b.rotulo),
      sortDirections: ['ascend', 'descend'],
      width: 150,
    },
    {
      title: 'Quantia',
      dataIndex: 'quantia',
      editable: true,
      sorter: (a, b) => a.quantia - b.quantia,
      sortDirections: ['ascend', 'descend'],
      width: 120,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      editable: true,
      sorter: (a, b) => new Date(a.data) - new Date(b.data),
      sortDirections: ['ascend', 'descend'],
      width: 150,
    },
    {
      title: 'Parcelas',
      dataIndex: 'parcelas',
      editable: true,
      sorter: (a, b) => a.parcelas - b.parcelas,
      sortDirections: ['ascend', 'descend'],
      width: 120,
    },
    {
      title: 'Formato',
      dataIndex: 'formato',
      editable: true,
      sorter: (a, b) => a.formato.localeCompare(b.formato),
      sortDirections: ['ascend', 'descend'],
      width: 150,
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      editable: true,
      sorter: (a, b) => a.categoria - b.categoria,
      sortDirections: ['ascend', 'descend'],
      width: 200,
      render: (text) => categories.find((cat) => cat.id === text)?.nome || text,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text, record) => (
        <Popconfirm
          title="Tem certeza que deseja deletar?"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button type="danger">Deletar</Button>
        </Popconfirm>
      ),
      width: 120,
    },
  ];

  const editableColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
      categories,
    }),
  }));

  return (
    <div>
      <AppHeader />
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableTable,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={editableColumns}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      
      {/* Botão para abrir o modal */}
      <Button
        type="primary"
        shape="circle"
        icon="plus"
        size="large"
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
        }}
      />
      
      {/* Modal para criar novo gasto */}
      <ModalGasto
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGastoCreated={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default App;
