import React, { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Stack, Button, Typography, Card, IconButton, Snackbar, Alert } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { UserAlert, PopupAlertType, ResponseErr, DialogSettings } from '../../types';

// Obtain Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

const defaultNewUserAlert: UserAlert = {
  name: '',
  containerId: '',
  targetMetric: 'CPU %',
  threshold: 25,
  email: '',
};

const defaultPopupAlert: PopupAlertType = {
  open: false,
  message: 'Something went wrong',
  severity: 'warning',
};

const defaultDialogSettings: DialogSettings = {
  open: false,
  mode: 'NEW',
  uuid: '',
};

export default function Alerts() {
  const [userAlerts, setUserAlerts] = useState<UserAlert[]>([]);
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>(defaultDialogSettings);
  const [newUserAlert, setNewUserAlert] = useState<UserAlert>(defaultNewUserAlert);
  const [popupAlert, setPopupAlert] = useState<PopupAlertType>(defaultPopupAlert);

  const ddClient = useDockerDesktopClient();

  const handlePopupAlertClose = () => setPopupAlert({ ...popupAlert, open: false });

  const triggerPopupAlertFromErr = (err: unknown) => {
    setPopupAlert({
      open: true,
      message: (err as ResponseErr).message,
      severity: 'error',
    });
  };

  useEffect(() => {
    // Refresh the alerts every 5 seconds
    const intervalId = setInterval(() => {
      refreshAlerts();
    }, 5000);

    refreshAlerts(); // Invoke on mount

    return () => clearInterval(intervalId);
  }, []);

  // Fetch the user's saved alerts from the extension server
  const refreshAlerts = async () => {
    try {
      const response = (await ddClient.extension.vm?.service?.get('/api/alerts')) as UserAlert[];
      return setUserAlerts(response);
    } catch (err) {
      triggerPopupAlertFromErr(err);
    }
  };

  const handleCreateUserAlert = async () => {
    try {
      const response = (await ddClient.extension.vm?.service?.post(
        '/api/alerts',
        newUserAlert
      )) as UserAlert;
      setUserAlerts([...userAlerts, response]);
    } catch (err) {
      triggerPopupAlertFromErr(err);
    }
  };

  const handleUpdateUserAlert = async (uuid: string) => {
    try {
      const response = (await ddClient.extension.vm?.service?.put(
        `/api/alerts/${uuid}`,
        newUserAlert
      )) as UserAlert;

      const newUserAlerts = structuredClone(userAlerts);
      const updatedAlertIndex = newUserAlerts.findIndex((e) => e.uuid === uuid);
      newUserAlerts[updatedAlertIndex] = response;
      setUserAlerts(newUserAlerts);
    } catch (err) {
      triggerPopupAlertFromErr(err);
    }
  };

  const handleDeleteUserAlert = async (uuid: string) => {
    try {
      await ddClient.extension.vm?.service?.delete(`/api/alerts/${uuid}`);

      const newUserAlerts = structuredClone(userAlerts);
      const updatedAlertIndex = newUserAlerts.findIndex((e) => e.uuid === uuid);
      newUserAlerts.splice(updatedAlertIndex, 1);
      setUserAlerts(newUserAlerts);
    } catch (err) {
      triggerPopupAlertFromErr(err);
    }
  };

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
        dialogSettings={dialogSettings}
        setDialogSettings={setDialogSettings}
        handleCreateUserAlert={handleCreateUserAlert}
        handleUpdateUserAlert={handleUpdateUserAlert}
        newUserAlert={newUserAlert}
        setNewUserAlert={setNewUserAlert}
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
        <Button
          variant="contained"
          onClick={() => {
            setNewUserAlert(defaultNewUserAlert);
            setDialogSettings({ open: true, mode: 'NEW', uuid: undefined });
          }}
        >
          Create Alert
        </Button>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
          <Stack direction="column" spacing={2}>
            {userAlerts.map((userAlert) => (
              <AlertCard
                userAlert={userAlert}
                setNewUserAlert={setNewUserAlert}
                setDialogSettings={setDialogSettings}
                handleDeleteUserAlert={handleDeleteUserAlert}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

type AlertCardProps = {
  userAlert: UserAlert;
  setNewUserAlert: React.Dispatch<React.SetStateAction<UserAlert>>;
  setDialogSettings: React.Dispatch<React.SetStateAction<DialogSettings>>;
  handleDeleteUserAlert: Function;
};

function AlertCard({
  userAlert,
  setNewUserAlert,
  setDialogSettings,
  handleDeleteUserAlert,
}: AlertCardProps) {
  const {
    uuid,
    name,
    containerId,
    targetMetric,
    threshold,
    email,
    lastExceeded,
    lastNotification,
    created,
  } = userAlert;

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
          <IconButton
            sx={{ ml: 'auto' }}
            onClick={() => {
              // In the EDIT mode, populate the dialog form fields with all the alert settings
              setDialogSettings({ open: true, mode: 'EDIT', uuid: uuid as string });
              setNewUserAlert(userAlert);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteUserAlert(uuid)}>
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
            <Typography>{lastExceeded ? timestampToISOString(lastExceeded) : '-'}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Last Notification Sent</Typography>
            <Typography>
              {lastNotification ? timestampToISOString(lastNotification) : '-'}
            </Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Notification Email</Typography>
            <Typography>{email}</Typography>
          </Stack>
          <Stack sx={{ pr: 2, py: 1 }}>
            <Typography variant="caption">Alert Created</Typography>
            <Typography>{created ? timestampToISOString(created) : '-'}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

function timestampToISOString(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString();
}
