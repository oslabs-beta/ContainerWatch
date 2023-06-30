import { useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Stack, Button, Typography, Card, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { Alert } from '../../types';

const MOCK_ALERTS: Alert[] = [
  {
    name: 'My Custom Alert',
    containerId: '1024453d18bd5d7d45741471b765f48b2ec2a6f1e89d5834e0d69b0b69e039bc',
    targetMetric: 'CPU %',
    threshold: 50,
    email: 'coolguy@gmail.com',
    lastExceeded: Date.now(),
    lastNotification: Date.now(),
    created: Date.now(),
  },
  {
    name: 'Another One',
    containerId: 'ddfd67f9a7d5b55f549efdf4c9268fca3da90958864e1688a247767227247de3',
    targetMetric: 'MEM %',
    threshold: 25,
    email: 'coolguy@gmail.com',
    lastExceeded: Date.now(),
    lastNotification: Date.now(),
    created: Date.now(),
  },
];

// Obtain Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const ddClient = useDockerDesktopClient();

  return (
    <>
      <AlertDialog ddClient={ddClient} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      <Box
        sx={{
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Create Alert
        </Button>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
          <Stack direction="column" spacing={2}>
            {alerts.map((alert) => (
              <AlertCard {...alert} />
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

function AlertCard({
  name,
  containerId,
  targetMetric,
  threshold,
  email,
  lastExceeded,
  lastNotification,
  created,
}: Alert) {
  return (
    <Card sx={{ px: 2, py: 1 }}>
      <Stack direction="column" spacing={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">{name}</Typography>
          <IconButton sx={{ ml: 'auto' }}>
            <Edit />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            maxWidth: '100%',
          }}
        >
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Container ID</Typography>
            <Typography>{containerId.slice(0, 12)}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Target Metric</Typography>
            <Typography>{targetMetric}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Threshold</Typography>
            <Typography>{threshold}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Threshold Last Exceeded</Typography>
            <Typography>{lastExceeded}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Last Notification Sent</Typography>
            <Typography>{lastNotification}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Notification Email</Typography>
            <Typography>{email}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Alert Created</Typography>
            <Typography>{created}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
