import { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Stack, Button, Typography, Card, IconButton, Snackbar, Alert } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { UserAlert, PopupAlertType } from '../../types';

const MOCK_ALERTS: UserAlert[] = [
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
  const [userAlerts, setUserAlerts] = useState(MOCK_ALERTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popupAlert, setPopupAlert] = useState<PopupAlertType>({
    open: false,
    message: 'Something went wrong',
    severity: 'warning',
  });

  const ddClient = useDockerDesktopClient();

  const handlePopupAlertClose = () => setPopupAlert({ ...popupAlert, open: false });

  const handleDeleteUserAlert = async (id: string) => {
    console.log('Deleting alert for ');
  };

  useEffect(() => {
    (async () => {
      try {
        const response = (await ddClient.extension.vm?.service?.get('/api/alerts')) as UserAlert[];

        // There was an fetching the user's alerts
        if ('statusCode' in response) {
          return setPopupAlert({
            open: true,
            message: "There was an error while fetching the user's alerts",
            severity: 'error',
          });
        }

        return setUserAlerts(response);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <>
      <Snackbar
        open={popupAlert.open}
        autoHideDuration={4000}
        onClose={handlePopupAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handlePopupAlertClose} severity="warning">
          {popupAlert.message}
        </Alert>
      </Snackbar>
      <AlertDialog
        ddClient={ddClient}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setPopupAlert={setPopupAlert}
        userAlerts={userAlerts}
        setUserAlerts={setUserAlerts}
      />
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
            {userAlerts.map((alert) => (
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
}: UserAlert) {
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
