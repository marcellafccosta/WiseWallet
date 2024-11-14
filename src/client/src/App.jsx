import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tabela from '../src/pages/Tabela'


function App() {
  return (
    <>
    <h1>WiseWallet</h1>
      <Router>
        <Routes>
        <Route path="/tabela" element={<Tabela/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
