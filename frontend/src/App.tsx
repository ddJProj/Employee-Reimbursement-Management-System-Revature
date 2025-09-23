import { useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Header from './components/pages/layout/Header';
import Footer from './components/pages/layout/Footer';
import Dashboard from './components/pages/dashboard/Dashboard';


function App() {
  return (
    <Router>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Header />

      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Hello Tailwind!
      </button>

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
