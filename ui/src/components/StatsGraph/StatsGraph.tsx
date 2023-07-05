import { Stack, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

type StatsGraphProps = {
  containerName: string;
  containerID: string;
};

type TimeFrame = '5m' | '15m' | '1h' | '2h' | '1d' | '2d' | '3d';

export default function StatsGraph({ containerName, containerID }: StatsGraphProps) {
  // The short-form containerID (12 digits) is used for the Grafana dashboards
  // because the full container (64 digits) is too long. Grafana API sets a
  // 40 character limit on a dashboard name.
  const shortContainerID = containerID.slice(0, 12);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('15m');

  return (
    <Stack direction="column" spacing={1}>
      <FormControl sx={{ m: 0, maxWidth: 130 }} size="small">
        <InputLabel>Time</InputLabel>
        <Select
          autoWidth
          value={timeFrame}
          label="Age"
          onChange={(e: SelectChangeEvent<TimeFrame>) => setTimeFrame(e.target.value as TimeFrame)}
        >
          <MenuItem value={'5m'}>5 Minute</MenuItem>
          <MenuItem value={'15m'}>15 Minute</MenuItem>
          <MenuItem value={'1h'}>1 Hour</MenuItem>
          <MenuItem value={'2h'}>2 Hour</MenuItem>
          <MenuItem value={'1d'}>1 Day</MenuItem>
          <MenuItem value={'2d'}>2 Day</MenuItem>
          <MenuItem value={'3d'}>3 Day</MenuItem>
        </Select>
      </FormControl>
      <iframe
        src={`http://localhost:2999/d-solo/${shortContainerID}/${containerName}?orgId=1&refresh=15s&panelId=1&from=now-${timeFrame}&to=now`}
        width="100%"
        height="300px"
        style={{ border: 0 }}
      />
    </Stack>
  );
}
