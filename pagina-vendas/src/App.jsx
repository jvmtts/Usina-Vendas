import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { produtos } from './data/produtos';
import Vitrine from './components/Vitrine';
import DetalhesProduto from './components/DetalhesProduto';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Vitrine produtos={produtos} />} />
          <Route path="/produto/:id" element={<DetalhesProduto produtos={produtos} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;