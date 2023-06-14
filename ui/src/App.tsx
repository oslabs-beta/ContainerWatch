// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Stats from './pages/Stats';
import Logs from './pages/Logs/Logs';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Stats />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
}
