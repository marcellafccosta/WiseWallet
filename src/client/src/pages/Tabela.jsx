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
            value={record.formato !== 'CREDITO' ? 1 : record[dataIndex]} // Se não for CREDITO, forçar valor para 1
            disabled={record.formato !== 'CREDITO'} // Desabilitar se não for CREDITO
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
     else if (dataIndex === 'formato') {
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
  const [modalCategoryOpen, setModalCategoryOpen] = useState(false); // Estado para o modal de categorias
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();

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

  const handleAddCategory = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/categorias', { nome: values.nome });
      const newCategory = response.data;
  
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      message.success('Categoria adicionada com sucesso');
      categoryForm.resetFields(); // Limpa o formulário
      setModalCategoryOpen(false); // Fecha o modal
    } catch (error) {
      message.error('Erro ao adicionar categoria');
    }
  };
  


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
  
    // Verificar se o formato não é 'CREDITO' e ajustar parcelas
    if (row.formato !== 'CREDITO') {
      row.parcelas = 1;  // Forçar parcelas para 1 se formato não for 'CREDITO'
    }
  
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
      <Button
  type="primary"
  onClick={() => setModalCategoryOpen(true)}
  style={{
    marginBottom: 10,
    backgroundColor: '#5ab334',  // Cor de fundo
  }}
>
  Adicionar Categoria
</Button>


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
  pagination={{
    pageSize: 5, // Limita a 5 itens por página
    position: ['bottomCenter'], // Centraliza a paginação abaixo da tabela
  }}
  scroll={{ x: 'max-content' }}
  style={{ marginBottom: 20 }} // Espaçamento inferior de 20px
/>


<Modal
  title="Adicionar Categoria"
  style={{ top: 20 }}
  open={modalCategoryOpen}
  onOk={() => categoryForm.submit()} // Enviar os dados ao clicar em OK
  onCancel={() => setModalCategoryOpen(false)} // Fechar o modal
>
  <Form
    form={categoryForm} // Objeto do formulário de categoria
    layout="vertical"
    onFinish={handleAddCategory} // Método que será chamado ao enviar o formulário
  >
    <Form.Item
      label="Nome da Categoria"
      name="nome"
      rules={[{ required: true, message: 'O nome da categoria é obrigatório' }]}
    >
      <Input placeholder="Ex.: Alimentação, Transporte, etc." />
    </Form.Item>
  </Form>
</Modal>


<Modal
  title="Adicionar Gasto"
  style={{ top: 20 }}
  open={modal1Open}
  onOk={() => form.submit()} // Usa o método submit do form para enviar os dados
  onCancel={() => setModal1Open(false)}
>
  <Form
    form={form} // Passa o objeto form aqui
    layout="vertical"
    onFinish={async (values) => {
      try {
        const newGasto = {
          rotulo: values.rotulo,
          quantia: values.quantia,
          data: new Date(values.data).toISOString(),
          parcelas: values.parcelas,
          formato: values.formato,
          categoriaId: values.categoria,
          usuarioId: parseInt(idUsuario, 10), // Conversão para inteiro
        };
    
        console.log('Valores do formulário:', values);
        console.log('JSON gerado:', newGasto);
    
        if (!idUsuario) {
          console.error('Erro: idUsuario está undefined.');
          message.error('Erro: Usuário não identificado.');
          return;
        }
    
        await axios.post('http://localhost:3000/gastos', newGasto);
    
        setDataSource((prevData) => [
          ...prevData,
          {
            key: new Date().valueOf(),
            ...newGasto,
          },
        ]);
    
        message.success('Gasto adicionado com sucesso');
        setModal1Open(false);
        form.resetFields();
      } catch (error) {
        console.error('Erro ao enviar o gasto:', error.response?.data || error.message);
        message.error('Erro ao adicionar gasto');
      }
    }}    
  >
    <Form.Item
      label="Rótulo"
      name="rotulo"
      rules={[{ required: true, message: 'O rótulo é obrigatório' }]}
    >
      <Input placeholder="Ex.: Compra de supermercado" />
    </Form.Item>
    <Form.Item
      label="Quantia"
      name="quantia"
      rules={[{ required: true, message: 'A quantia é obrigatória' }]}
    >
      <InputNumber
        style={{ width: '100%' }}
        placeholder="Ex.: 250.75"
        min={0.01}
        step={0.01}
      />
    </Form.Item>
    <Form.Item
  label="Data"
  name="data"
  rules={[{ required: true, message: 'A data é obrigatória' }]}
>
  <Input
    type="date" // Alterar de datetime-local para date
    placeholder="Selecione a data"
  />
</Form.Item>

<Form.Item
  label="Formato"
  name="formato"
  rules={[{ required: true, message: 'O formato é obrigatório' }]}
>
  <Select 
    placeholder="Selecione o formato"
    onChange={(value) => {
      // Reseta as parcelas para 1 e desabilita se não for 'CREDITO'
      form.setFieldsValue({
        parcelas: value !== 'CREDITO' ? 1 : form.getFieldValue('parcelas'),
      });
    }}
  >
    <Select.Option value="CREDITO">CREDITO</Select.Option>
    <Select.Option value="DEBITO">DEBITO</Select.Option>
    <Select.Option value="BOLETO">BOLETO</Select.Option>
    <Select.Option value="PIX">PIX</Select.Option>
    <Select.Option value="DINHEIRO">DINHEIRO</Select.Option>
  </Select>
</Form.Item>

<Form.Item
  label="Parcelas"
  name="parcelas"
  rules={[{ required: true, message: 'As parcelas são obrigatórias' }]}>
  <InputNumber
    style={{ width: '100%' }}
    placeholder="Ex.: 3"
    min={1}
    step={1}
    value={form.getFieldValue('formato') !== 'CREDITO' ? 1 : form.getFieldValue('parcelas')} // Define 1 como valor fixo se não for 'CREDITO'
    onChange={(value) => {
      // Se o formato não for 'CREDITO', reseta automaticamente o número de parcelas para 1
      if (form.getFieldValue('formato') !== 'CREDITO' && value !== 1) {
        form.setFieldsValue({
          parcelas: 1, // Reseta o valor para 1
        });
      } else {
        form.setFieldsValue({
          parcelas: value, // Atualiza o valor das parcelas
        });
      }
    }}
  />
</Form.Item>

    <Form.Item
      label="Categoria"
      name="categoria"
      rules={[{ required: true, message: 'A categoria é obrigatória' }]}
    >
      <Select placeholder="Selecione a categoria">
        {categories.map((category) => (
          <Select.Option key={category.id} value={category.id}>
            {category.nome}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Form>
</Modal>

<Button
  type="primary"
  shape="circle"
  style={{
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    border: 0,
    borderRadius: '50%',
    fontSize: 24,
    backgroundColor: '#5ab334',  // Cor de fundo
  }}
  onClick={() => setModal1Open(true)}
  icon={null}  // Remover ícone
>
  +
</Button>

    </div>
  );
};

export default App;