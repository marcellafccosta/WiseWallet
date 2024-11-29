import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, message, Button, Form, Input, Popconfirm, InputNumber, Select, Modal } from 'antd';
import axios from 'axios';
import AppHeader from '../components/Header';

const EditableContext = React.createContext(null);

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

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  categories,
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
    if (dataIndex === 'quantia') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
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
    } else if (dataIndex === 'parcelas') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
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
    } else if (dataIndex === 'formato') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
          <Select
            ref={inputRef}
            onChange={save}
            onBlur={save}
            defaultValue={record[dataIndex]}
            style={{ width: '100%' }}
          >
            <Select.Option value="CREDITO">CREDITO</Select.Option>
            <Select.Option value="DEBITO">DEBITO</Select.Option>
            <Select.Option value="BOLETO">BOLETO</Select.Option>
            <Select.Option value="PIX">PIX</Select.Option>
            <Select.Option value="DINHEIRO">DINHEIRO</Select.Option>
          </Select>
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
    } else if (dataIndex === 'categoria') {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
          <Select
            ref={inputRef}
            onChange={save}
            onBlur={save}
            defaultValue={record[dataIndex]}
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.nome}
              </Select.Option>
            ))}
          </Select>
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
    } else {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
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
  const [idUsuario, setIdUsuario] = useState(null);
  const [modal1Open, setModal1Open] = useState(false);

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
        <>
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="danger">Deletar</Button>
          </Popconfirm>
        </>
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
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={editableColumns}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Detalhes"
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
      >
        <p>Conteúdo do Modal...</p>
      </Modal>

      <Button
        type="primary"
        shape="circle"
        icon="plus"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          fontSize: 24,
        }}
        onClick={() => setModal1Open(true)}
      />
    </div>
  );
};

export default App;
