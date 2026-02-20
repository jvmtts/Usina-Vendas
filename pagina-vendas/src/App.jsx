import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Vitrine from './components/Vitrine';
import DetalhesProduto from './components/DetalhesProduto';

function App() {
  return (
    <BrowserRouter>
      <div className="container-site">
        <Routes>
          <Route path="/" element={<Vitrine />} />
          <Route path="/produto/:id" element={<DetalhesProduto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;