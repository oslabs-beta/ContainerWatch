import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Box, Typography, Tabs, Tab } from '@mui/material';
import { ReactComponent as DockerPulseSVG } from '../../../assets/dockerpulse.svg';

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
    <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ height: '24px', width: '24px' }}>
          <DockerPulseSVG />
        </Box>
        <Typography variant="h3">DockerPulse</Typography>
      </Stack>
      <Tabs value={value} onChange={handleChange}>
        {pages.map(({ label, path }) => (
          <Tab label={label} to={path} component={Link} />
        ))}
      </Tabs>
    </Stack>
  );
}
