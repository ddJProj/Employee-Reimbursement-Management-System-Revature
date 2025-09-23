import { useState } from 'react';
import Header from './components/pages/layout/Header.jsx'
import Footer from './components/pages/layout/Footer.jsx'

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Header />

      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Hello Tailwind!
      </button>

      <Footer />
    </div>
  );
}

export default App;
