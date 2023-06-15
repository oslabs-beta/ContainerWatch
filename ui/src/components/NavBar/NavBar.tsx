import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Typography, Tabs, Tab } from '@mui/material';

const pages = [
  { label: 'Stats', path: '/' },
  { label: 'Logs', path: '/logs' },
  { label: 'Settings', path: '/settings' },
];

export default function NavBar() {
  const [value, setValue] = useState(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <Typography variant="h3">DockerPulse</Typography>
      <Tabs value={value} onChange={handleChange}>
        {pages.map(({ label, path }) => (
          <Tab label={label} to={path} component={Link} />
        ))}
      </Tabs>
    </Stack>
  );
}
