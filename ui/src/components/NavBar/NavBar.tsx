import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Box, Typography, Tabs, Tab } from '@mui/material';
import { ReactComponent as DockerPulseSVG } from '../../../assets/dockerpulse.svg';

const pages = [
  { id: 1, label: 'Stats', path: '/' },
  { id: 2, label: 'Logs', path: '/logs' },
  { id: 3, label: 'Alerts', path: '/alerts' },
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
        {pages.map(({ id, label, path }) => (
          <Tab key={id} label={label} to={path} component={Link} />
        ))}
      </Tabs>
    </Stack>
  );
}
