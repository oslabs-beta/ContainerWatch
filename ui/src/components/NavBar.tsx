import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

export default function NavBar() {
  return (
    <Stack direction="row" alignItems="start" spacing={2}>
      <Link to="/">Stats</Link>
      <Link to="/logs">Logs</Link>
      <Link to="/settings">Settings</Link>
    </Stack>
  );
}
