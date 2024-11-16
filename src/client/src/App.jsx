import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tabela from '../src/pages/Tabela'
import Login from '../src/pages/login'
import Cadastro from '../src/pages/cadastro'
import Perfil from '../src/pages/perfil'

function App() {
  return (
    <>
    <h1>WiseWallet</h1>
      <Router>
        <Routes>
        <Route path="/tabela" element={<Tabela/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/perfil/:id" element={<Perfil/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
