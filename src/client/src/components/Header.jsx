import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Spin } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Header.css';
import logopreta from "../assets/logopreta.png";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem('idusuario');
    const [loading, setLoading] = useState(true);



    // Configuração dinâmica dos itens do menu
    let menuItems = [
        { key: 'home', label: <Link to="/">Home</Link> },
        { key: 'tabela', label: <Link to="/tabela">Tabela</Link> },
        { key: 'relatorio', label: <Link to="/relatorio">Relatório</Link> },
    ];

    // Adicionar opções para usuários autenticados
    if (idUsuario) {
        menuItems.push(
            { key: 'perfil', label: <Link to="/perfil">Meu Perfil</Link> },
            { key: 'logout', label: <Button type="link" onClick={() => handleLogout()}>Sair</Button> }
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('idusuario');
        navigate('/login');
    };

 

    return (
        <Header className="app-header">
            <div className="container">
                <div className="logo">
                    <img 
                        src={logopreta}
                        alt="Logo WiseWallet" 
                        className="logo-image" 
                        onClick={() => navigate('/')} 
                    />
                </div>
                <Menu mode="horizontal" items={menuItems} className="menu-desktop" />
                <div className="user-actions">
                    {/* Botões adicionais ou ações de usuário */}
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
