import { useEffect, useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
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
import { DockerDesktopClient, DockerContainer, Alert } from '../../types';

type AlertDialogProps = {
  ddClient: DockerDesktopClient;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const metricHelperText = {
  'CPU %': '% of CPU used by the container based on the number of cores allocated',
  'MEM %': '% of memory used by the container',
};

export default function AlertDialog({ ddClient, dialogOpen, setDialogOpen }: AlertDialogProps) {
  const [containers, setContainers] = useState<DockerContainer[]>();

  const [alert, setAlert] = useState<Alert>({
    name: '',
    containerId: '',
    targetMetric: 'CPU %',
    threshold: 25,
    email: '',
  });

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
    const response = (await ddClient.extension.vm?.service?.get('/hello')) as any;
    console.log(response);
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Create a new alert</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <FormControl required>
            <TextField
              label="Name"
              variant="outlined"
              autoFocus
              value={alert.name}
              onChange={(e) => setAlert({ ...alert, name: e.target.value })}
              sx={{ width: '400px' }}
            />
            <FormHelperText>A name for your alert!</FormHelperText>
          </FormControl>

          <FormControl required>
            <InputLabel>Container</InputLabel>
            <Select
              label="Container"
              displayEmpty
              value={alert.containerId}
              onChange={(e) => setAlert({ ...alert, containerId: e.target.value })}
              sx={{ width: '400px' }}
            >
              {containers?.map(({ Id, Names }) => (
                <MenuItem value={Id}>{Names[0].replace(/^\//, '')}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{alert.containerId.slice(0, 12) || ' '}</FormHelperText>
          </FormControl>

          <FormControl required>
            <InputLabel>Target metric</InputLabel>
            <Select
              label="Target metric"
              displayEmpty
              value={alert.targetMetric}
              onChange={(e) =>
                setAlert({ ...alert, targetMetric: e.target.value as 'CPU %' | 'MEM %' })
              }
              sx={{ width: '400px' }}
            >
              <MenuItem value={'CPU %'}>CPU %</MenuItem>
              <MenuItem value={'MEM %'}>MEM %</MenuItem>
            </Select>
            <FormHelperText>{metricHelperText[alert.targetMetric]}</FormHelperText>
          </FormControl>

          <FormControl required>
            <TextField
              required
              label="Threshold"
              type="number"
              variant="outlined"
              value={alert.threshold}
              onChange={(e) => setAlert({ ...alert, threshold: parseInt(e.target.value) })}
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
              value={alert.email}
              onChange={(e) => setAlert({ ...alert, email: e.target.value })}
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
