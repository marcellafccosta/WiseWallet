import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from '@ant-design/plots';
import AppHeader from '../components/Header';
import "../style/Relatorio.css";

const Relatorio = () => {
    const [dataCategoria, setDataCategoria] = useState([]); // Dados para o gráfico de categorias
    const [dataMes, setDataMes] = useState([]); // Dados para o gráfico de meses
    const [dataAno, setDataAno] = useState([]); // Dados para o gráfico de anos
    const [dataFormato, setDataFormato] = useState([]); // Dados para o gráfico de formatos
    const [categoryMap, setCategoryMap] = useState({}); // Mapa para as categorias

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        if (isNaN(date)) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Corrigido para '0'
        const year = String(date.getFullYear()); // Mantém o ano completo
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categorias');
                const map = response.data.reduce((acc, item) => {
                    acc[item.id] = item.nome; // { 1: 'Alimentação', 2: 'Transporte' }
                    return acc;
                }, {});
                setCategoryMap(map);
            } catch (error) {
                console.error('Erro ao buscar as categorias:', error);
            }
        };

        const fetchGastosPorCategoria = async () => {
            try {
                const response = await axios.get('http://localhost:3000/relatorio/categoria');
                setDataCategoria(
                    response.data.map(item => ({
                        type: categoryMap[item.categoria] || `Categoria ${item.categoria}`, // Mapeia os nomes
                        valor: item.total,
                    }))
                );
            } catch (error) {
                console.error('Erro ao buscar os dados por categoria:', error);
            }
        };

        const fetchGastosPorMes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/relatorio/mes');
                setDataMes(
                    response.data.map(item => ({
                        type: item.mes, // Nome do mês já retornado pelo backend
                        valor: item.total,
                    }))
                );
            } catch (error) {
                console.error('Erro ao buscar os dados por mês:', error);
            }
        };


        const fetchGastosPorAno = async () => {
            try {
                const response = await axios.get('http://localhost:3000/relatorio/ano');
                setDataAno(
                    response.data.map(item => ({
                        type: item.ano, // Use o ano diretamente
                        valor: item.total,
                    }))
                );
            } catch (error) {
                console.error('Erro ao buscar os dados por ano:', error);
            }
        };


        const fetchGastosPorFormato = async () => {
            try {
                const response = await axios.get('http://localhost:3000/relatorio/formato');
                setDataFormato(
                    response.data.map(item => ({
                        type: item.formato, // Nome do formato (CREDITO, DEBITO, etc.)
                        valor: item.total, // Valor total para o formato
                    }))
                );
            } catch (error) {
                console.error('Erro ao buscar os dados por formato:', error);
            }
        };



        const loadData = async () => {
            await fetchCategorias();
            await fetchGastosPorCategoria();
            await fetchGastosPorMes();
            await fetchGastosPorAno();
            await fetchGastosPorFormato();
        };

        loadData();
    }, [categoryMap]);

    const configCategoria = {
        data: dataCategoria,
        angleField: 'valor',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider', // Tipo de rótulo que se adapta melhor
            content: '{name}: {percentage}',
        },
        legend: {
            position: 'bottom',
        },
        appendPadding: 10, // Espaçamento interno
        autoFit: true, // Permite ajustar automaticamente ao contêiner
        height: 300, // Altura consistente do gráfico
        width: 300, // Largura consistente do gráfico
        interactions: [{ type: 'element-active' }],
    };


    const configMes = {
        data: dataMes,
        angleField: 'valor',
        colorField: 'type',
        radius: 0.8,
        label: {
            content: '{name} {percentage}',
            type: 'spider',
        },
        legend: {
            position: 'bottom',
        },
        appendPadding: 10, // Espaçamento interno
        autoFit: true, // Permite ajustar automaticamente ao contêiner
        height: 300, // Altura consistente do gráfico
        width: 300, // Largura consistente do gráfico
        interactions: [{ type: 'element-active' }],
    };

    const configAno = {
        data: dataAno,
        angleField: 'valor',
        colorField: 'type',
        radius: 0.8,
        label: {
            content: '{name} {percentage}',
            type: 'spider',
        },
        legend: {
            position: 'bottom',
        },
        appendPadding: 10, // Espaçamento interno
        autoFit: true, // Permite ajustar automaticamente ao contêiner
        height: 300, // Altura consistente do gráfico
        width: 300, // Largura consistente do gráfico
        interactions: [{ type: 'element-active' }],
    };

    const configFormato = {
        data: dataFormato,
        angleField: 'valor',
        colorField: 'type',
        radius: 0.8,
        label: {
            content: '{name} {percentage}',
            type: 'spider',
        },
        legend: {
            position: 'bottom',
        },
        appendPadding: 10, // Espaçamento interno
        autoFit: true, // Permite ajustar automaticamente ao contêiner
        height: 300, // Altura consistente do gráfico
        width: 300, // Largura consistente do gráfico
        interactions: [{ type: 'element-active' }],
    }

    return (
        <><AppHeader /><div style={{ width: '100%', height: 'auto' }}>
            <h1>Relatório de Gastos</h1>
            <div className='graficos'>
                <div style={{ marginBottom: '50px' }}>
                    <h2>Gastos por Categoria</h2>
                    <Pie {...configCategoria} />
                </div>
                <div style={{ marginBottom: '50px' }}>
                    <h2>Gastos por Mês</h2>
                    <Pie {...configMes} />
                </div>
                <div>
                    <h2>Gastos por Ano</h2>
                    <Pie {...configAno} />
                </div>

                <div>
                    <h2>Gastos por Formato</h2>
                    <Pie {...configFormato} />
                </div>

            </div>
        </div></>
    );
};

export default Relatorio;
