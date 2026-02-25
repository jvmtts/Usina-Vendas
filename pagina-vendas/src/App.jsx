import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Vitrine from './components/Vitrine';
import DetalhesProduto from './components/DetalhesProduto';
import { produtos } from './data/produtos';

import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  return (
    <Router>

      <ScrollToTopButton />
      
      <div className="App bg-gray-50 min-h-screen relative">

        <Routes>
          <Route path="/" element={<Vitrine produtos={produtos} />} />
          <Route path="/produto/:id" element={<DetalhesProduto produtos={produtos} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;