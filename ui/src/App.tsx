import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Stats from './pages/Stats/Stats';
import Logs from './pages/Logs/Logs';
import Alerts from './pages/Alerts/Alerts';
import NavBar from './components/NavBar/NavBar';

export default function App() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Stats />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Box>
  );
}
