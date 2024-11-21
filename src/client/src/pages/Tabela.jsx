import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, message, Button, Form, Input, Popconfirm, InputNumber } from 'antd';
import axios from 'axios';
import AppHeader from '../components/Header';

// Definição do contexto de edição
const EditableContext = React.createContext(null);

// Componente de linha editável
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Componente de célula editável
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    // Se for 'quantia', usamos InputNumber para garantir que seja um número com ponto flutuante
    if (dataIndex === 'quantia') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]} >
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: '100%' }} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    // Se for 'parcelas', usamos InputNumber com propriedades adequadas para inteiros
    else if (dataIndex === 'parcelas') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]} >
          <InputNumber
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            style={{ width: '100%' }}
            min={1}
            step={1}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    else {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]} >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const App = () => {
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);

  // Buscar dados
  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/gastos');
        const formattedData = response.data.map((item) => ({
          key: item.id, // Usando o id como chave
          rotulo: item.rotulo,
          quantia: item.quantia,
          data: item.data,
          parcelas: item.parcelas,
          formato: item.formato,
          categoria: item.categoriaId, // Aqui ainda usamos o id da categoria
        }));
        setDataSource(formattedData);
      } catch (error) {
        message.error('Erro ao carregar os dados dos gastos');
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategories(response.data); // Guardamos a lista completa de categorias
      } catch (error) {
        message.error('Erro ao carregar as categorias');
      }
    };

    fetchGastos();
    fetchCategorias();
  }, []);

  // Deletar item
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

  // Função para salvar alterações
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

  // Definir componentes editáveis para a tabela
  const columns = [
    {
      title: 'Rotulo',
      dataIndex: 'rotulo',
      editable: true,
      sorter: (a, b) => a.rotulo.localeCompare(b.rotulo),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Quantia',
      dataIndex: 'quantia',
      editable: true,
      sorter: (a, b) => a.quantia - b.quantia,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Data',
      dataIndex: 'data',
      editable: true,
      sorter: (a, b) => new Date(a.data) - new Date(b.data),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Parcelas',
      dataIndex: 'parcelas',
      editable: true,
      sorter: (a, b) => a.parcelas - b.parcelas,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Formato',
      dataIndex: 'formato',
      editable: true,
      filters: [
        { text: 'CREDITO', value: 'CREDITO' },
        { text: 'DEBITO', value: 'DEBITO' },
        { text: 'BOLETO', value: 'BOLETO' },
        { text: 'PIX', value: 'PIX' },
        { text: 'DINHEIRO', value: 'DINHEIRO' },
      ],
      onFilter: (value, record) => record.formato.includes(value),
      sorter: (a, b) => a.formato.localeCompare(b.formato),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      editable: true,
      filters: categories.map((cat) => ({
        text: cat.nome,  // Usando 'nome' no filtro
        value: cat.id,
      })),
      onFilter: (value, record) => record.categoria === value,
      sorter: (a, b) => a.categoria - b.categoria,
      sortDirections: ['ascend', 'descend'],
      render: (text) => categories.find((cat) => cat.id === text)?.nome || text, // Exibindo o 'nome'
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
    },
  ];

  // Definindo os componentes editáveis para a tabela
  const editableColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <><AppHeader /><div>
      <Table
        bordered
        dataSource={dataSource}
        columns={editableColumns}
        components={components}
        rowClassName="editable-row"
        pagination={false} />
    </div></>
  );
};

export default App;
