import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import fetchAllContainers from '../../actions/fetchAllContainers';
import { DDClient, DockerContainer, UserAlert, PopupAlertType, ResponseErr } from '../../types';
import { v4 as uuidv4 } from 'uuid';

type AlertDialogProps = {
  ddClient: DDClient;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupAlert: React.Dispatch<React.SetStateAction<PopupAlertType>>;
  userAlerts: UserAlert[];
  setUserAlerts: React.Dispatch<React.SetStateAction<UserAlert[]>>;
};

const metricHelperText = {
  'CPU %': '% of CPU used by the container based on the number of cores allocated',
  'MEM %': '% of memory used by the container',
};

export default function AlertDialog({
  ddClient,
  dialogOpen,
  setDialogOpen,
  setPopupAlert,
  userAlerts,
  setUserAlerts,
}: AlertDialogProps) {
  const [containers, setContainers] = useState<DockerContainer[]>();
  const [newUserAlert, setNewUserAlert] = useState<UserAlert>({
    uuid: '',
    name: '',
    containerId: '',
    targetMetric: 'CPU %',
    threshold: 25,
    email: '',
  });

  // Fetch all the user's containers which will populate the select options in the form
  useEffect(() => {
    (async () => {
      try {
        const containers = await fetchAllContainers(ddClient);
        setContainers(containers);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const createAlert = async () => {
    try {
      const response = (await ddClient.extension.vm?.service?.post('/api/alerts', {
        ...newUserAlert,
        uuid: uuidv4(),
      })) as UserAlert;

      if ('statusCode' in response) {
        const responseErr = response as unknown as ResponseErr;
        setPopupAlert({
          open: true,
          message: responseErr.message,
          severity: 'warning',
        });
      }

      setUserAlerts([...userAlerts, response]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Create a new alert</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <FormControl required>
            <TextField
              required
              label="Name"
              variant="outlined"
              autoFocus
              value={newUserAlert.name}
              onChange={(e) => setNewUserAlert({ ...newUserAlert, name: e.target.value })}
              sx={{ width: '400px' }}
            />
            <FormHelperText>A name for your alert!</FormHelperText>
          </FormControl>

          <FormControl required>
            <InputLabel>Container</InputLabel>
            <Select
              label="Container"
              displayEmpty
              value={newUserAlert.containerId}
              onChange={(e) => setNewUserAlert({ ...newUserAlert, containerId: e.target.value })}
              sx={{ width: '400px' }}
            >
              {containers?.map(({ Id, Names }) => (
                <MenuItem value={Id}>{Names[0].replace(/^\//, '')}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{newUserAlert.containerId.slice(0, 12) || ' '}</FormHelperText>
          </FormControl>

          <FormControl required>
            <InputLabel>Target metric</InputLabel>
            <Select
              label="Target metric"
              displayEmpty
              value={newUserAlert.targetMetric}
              onChange={(e) =>
                setNewUserAlert({
                  ...newUserAlert,
                  targetMetric: e.target.value as 'CPU %' | 'MEM %',
                })
              }
              sx={{ width: '400px' }}
            >
              <MenuItem value={'CPU %'}>CPU %</MenuItem>
              <MenuItem value={'MEM %'}>MEM %</MenuItem>
            </Select>
            <FormHelperText>{metricHelperText[newUserAlert.targetMetric]}</FormHelperText>
          </FormControl>

          <FormControl required>
            <TextField
              required
              label="Threshold"
              type="number"
              variant="outlined"
              value={newUserAlert.threshold}
              onChange={(e) =>
                setNewUserAlert({ ...newUserAlert, threshold: parseInt(e.target.value) })
              }
              sx={{ width: '400px' }}
              InputProps={{
                inputProps: {
                  min: 1,
                },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <FormHelperText>
              When the target metric exceeds the threshold, the Threshold Last Exceeded
            </FormHelperText>
            <FormHelperText>
              timestamp will update, and a notification email will be sent.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={newUserAlert.email}
              onChange={(e) => setNewUserAlert({ ...newUserAlert, email: e.target.value })}
            />
            <FormHelperText>Optional. Maximum one email per day.</FormHelperText>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            createAlert();
            setDialogOpen(false);
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
