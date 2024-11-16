import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tabela from '../src/pages/Tabela'
import Cadastro from '../src/pages/cadastro'
import Login from '../src/pages/login'


function App() {
  return (
    <>
    <h1>WiseWallet</h1>
      <Router>
        <Routes>
        <Route path="/tabela" element={<Tabela/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
