import React from 'react';
import { Layout, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import '../style/Homepage.css';
import AppHeader from '../components/Header';
import logo from "../assets/logo.png";

const { Content, Footer } = Layout;

// Hero Section Component
const HeroSection = () => (
    <section className="homepage__hero">
        <Row>
            <Col xs={24} md={12}>
                <h1>Gerencie suas finanças de forma inteligente</h1>
                <p>Com o WiseWallet, você tem total controle sobre seus gastos, receitas e planejamento financeiro. Simplifique sua vida financeira hoje mesmo.</p>
                <Button type="primary" size="large" className='homepage__button'>
                    <Link to="/cadastro">Comece Agora</Link>
                </Button>
            </Col>
            
                <img src={logo} alt="Logo WiseWallet" className="homepage__hero-image" />
            
        </Row>
    </section>
);

// Features Section Component
const Features = () => (
    <section className="homepage__features">
        <h2>Funcionalidades Principais</h2>
        <div className="homepage__feature-card-container">
            <div className="homepage__feature-card">
                <h3>Relatórios Detalhados</h3>
                <p>Acompanhe seus gastos e receitas com gráficos intuitivos e relatórios personalizados.</p>
            </div>
            <div className="homepage__feature-card">
                <h3>Organização Simples</h3>
                <p>Classifique suas despesas em categorias e mantenha tudo organizado com facilidade.</p>
            </div>
        </div>
    </section>
);

// Benefits Section Component
const Benefits = () => (
    <section className="homepage__benefits">
        <h2>Por que usar o WiseWallet?</h2>
        <ul>
            <li>Controle total sobre suas finanças.</li>
            <li>Interface simples e amigável.</li>
            <li>Segurança e privacidade garantidas.</li>
            <li>Ferramentas poderosas para planejamento financeiro.</li>
        </ul>
    </section>
);

// Footer Component
const HomepageFooter = () => (
    <Footer className="homepage__footer">
        <p>© 2024 WiseWallet. Todos os direitos reservados.</p>
    </Footer>
);

// Main Homepage Component
const Homepage = () => (
    <>
        <AppHeader />
        <Layout className="homepage__layout">
            <Content className="homepage__content">
                <HeroSection />
                <Features />
                <Benefits />
            </Content>
            <HomepageFooter />
        </Layout>
    </>
);

export default Homepage;
