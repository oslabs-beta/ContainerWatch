import { Stack, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useState } from 'react';

type StatsGraphProps = {
  containerName: string;
  containerID: string;
};

export default function StatsGraph({ containerName, containerID }: StatsGraphProps) {
  // The short-form containerID (12 digits) is used for the Grafana dashboards
  // because the full container (64 digits) is too long. Grafana API sets a
  // 40 character limit on a dashboard name.
  const shortContainerID = containerID.slice(0, 12);
  const [timeFrame, setTimeFrame] = useState('15m');
  const handleChange = (event: any) => {
    setTimeFrame(event.target.value);
  };

  return (
    <Stack direction="column" spacing={1}>
      <FormControl fullWidth>
        <InputLabel>Time Frame</InputLabel>
        <Select label="Age" onChange={handleChange}>
          <MenuItem value={'15m'}>15 Minutes</MenuItem>
          <MenuItem value={'60m'}>One Hour</MenuItem>
          <MenuItem value={'120m'}>Two Hour</MenuItem>
        </Select>
      </FormControl>
      <iframe
        key={timeFrame}
        src={`http://localhost:2999/d-solo/${shortContainerID}/${containerName}?orgId=1&refresh=15s&panelId=1&from=now-${timeFrame}&to=now`}
        width="100%"
        height="200px"
        style={{ border: 0 }}
      />
      <iframe
        src={`http://localhost:2999/d-solo/${shortContainerID}/${containerName}?orgId=1&refresh=15s&panelId=2&from=now-15m&to=now`}
        width="100%"
        height="200px"
        style={{ border: 0 }}
      />
    </Stack>
  );
}
