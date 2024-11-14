import React, { useState } from 'react';
import { Table } from 'antd';

// Definição das colunas com os tipos de dados apropriados
const columns = [
  {
    title: 'Rotulo',
    dataIndex: 'rotulo',
    sorter: (a, b) => a.rotulo.localeCompare(b.rotulo),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Quantia',
    dataIndex: 'quantia',
    sorter: (a, b) => a.quantia - b.quantia,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Data',
    dataIndex: 'data',
    sorter: (a, b) => new Date(a.data) - new Date(b.data),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Parcelas',
    dataIndex: 'parcelas',
    sorter: (a, b) => a.parcelas - b.parcelas,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Formato',
    dataIndex: 'formato',
    filters: [
      { text: 'Credito', value: 'Credito' },
      { text: 'Debito', value: 'Debito' },
      { text: 'Pix', value: 'Pix' },
    ],
    onFilter: (value, record) => record.formato.includes(value),
    sorter: (a, b) => a.formato.localeCompare(b.formato),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Categoria',
    dataIndex: 'categoria',
    onFilter: (value, record) => record.categoria.toLowerCase().includes(value.toLowerCase()),
    sorter: (a, b) => a.categoria.localeCompare(b.categoria),
    sortDirections: ['ascend', 'descend'],
    filters: [
      { text: 'Alimentação', value: 'Alimentação' },
      { text: 'Transporte', value: 'Transporte' },
      { text: 'Educação', value: 'Educação' },
    ],
  },
];

// Dados de exemplo
const data = [
  { key: '1', rotulo: 'Compra 1', quantia: 100.50, data: '2024-01-01', parcelas: 2, formato: 'Credito', categoria: 'Alimentação' },
  { key: '2', rotulo: 'Compra 2', quantia: 200.75, data: '2024-02-01', parcelas: 3, formato: 'Debito', categoria: 'Transporte' },
  { key: '3', rotulo: 'Compra 3', quantia: 150.00, data: '2024-03-01', parcelas: 1, formato: 'Pix', categoria: 'Educação' },
  { key: '4', rotulo: 'Compra 4', quantia: 120.50, data: '2024-04-01', parcelas: 4, formato: 'Credito', categoria: 'Alimentação' },
];

// Componente principal
const App = () => {
  const [dataSource, setDataSource] = useState(data);

  // Renderização da tabela
  return (
    <div>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
      />
    </div>
  );
};

export default App;
