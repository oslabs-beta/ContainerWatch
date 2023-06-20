import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Stats from './pages/Stats/Stats';
import Logs from './pages/Logs/Logs';
import Settings from './pages/Settings';
import NavBar from './components/NavBar/NavBar';

export default function App() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Logs />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Box>
  );
}
