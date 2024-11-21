import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tabela from '../src/pages/Tabela'
import Cadastro from '../src/pages/cadastro'
import Login from '../src/pages/login'
import Relatorio from '../src/pages/relatorio'
import Homepage from '../src/pages/homepage'


function App() {
  return (
    <>
    
      <Router>
        <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/tabela" element={<Tabela/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/relatorio" element={<Relatorio/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
