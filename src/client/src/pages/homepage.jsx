import React from 'react';
import { Layout, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import '../style/Homepage.css';
import AppHeader from '../components/Header';
import logo from "../assets/logo.png";

const { Header, Content, Footer } = Layout;

const Homepage = () => {
    return (
        <><AppHeader /><Layout className="homepage-layout">


            {/* Conteúdo Principal */}
            <Content className="homepage-content">
                <section className="hero">
                    <Row>
                        <Col xs={24} md={12}>
                            <h1>Gerencie suas finanças de forma inteligente</h1>
                            <p>Com o WiseWallet, você tem total controle sobre seus gastos, receitas e planejamento financeiro. Simplifique sua vida financeira hoje mesmo.</p>
                            <Button type="primary" size="large" className='botao'>
                                <Link to="/cadastro">Comece Agora</Link>
                            </Button>
                        </Col>
                        <Col xs={24} md={12}>
                            <img
                                src={logo}
                                alt="Logo"
                                className="hero-image" />
                        </Col>
                    </Row>
                </section>

                <section className="features">
                    <h2>Funcionalidades Principais</h2>
                    <div className="feature-card-container">
                        <div className="feature-card">
                            <h3>Relatórios Detalhados</h3>
                            <p>Acompanhe seus gastos e receitas com gráficos intuitivos e relatórios personalizados.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Organização Simples</h3>
                            <p>Classifique suas despesas em categorias e mantenha tudo organizado com facilidade.</p>
                        </div>

                    </div>
                </section>


                <section className="benefits">
                    <h2>Por que usar o WiseWallet?</h2>
                    <ul>
                        <li>Controle total sobre suas finanças.</li>
                        <li>Interface simples e amigável.</li>
                        <li>Segurança e privacidade garantidas.</li>
                        <li>Ferramentas poderosas para planejamento financeiro.</li>
                    </ul>
                </section>
            </Content>

            {/* Rodapé */}
            <Footer className="homepage-footer">
                <p>© 2024 WiseWallet. Todos os direitos reservados.</p>
                <p>
                    <Link to="/termos">Termos de Uso</Link> | <Link to="/privacidade">Política de Privacidade</Link>
                </p>
            </Footer>
        </Layout></>
    );
};

export default Homepage;
