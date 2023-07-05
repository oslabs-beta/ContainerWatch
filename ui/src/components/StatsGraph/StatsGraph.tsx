import { Stack } from '@mui/material';

type StatsGraphProps = {
  containerName: string;
  containerID: string;
};

export default function StatsGraph({ containerName, containerID }: StatsGraphProps) {
  // The short-form containerID (12 digits) is used for the Grafana dashboards
  // because the full container (64 digits) is too long. Grafana API sets a
  // 40 character limit on a dashboard name.
  const shortContainerID = containerID.slice(0, 12);

  return (
    <Stack direction="column" spacing={1}>
      <iframe
        src={`http://localhost:2999/d-solo/${shortContainerID}/${containerName}?orgId=1&refresh=15s&panelId=1&from=now-5m&to=now`}
        width="100%"
        height="200px"
        style={{ border: 0 }}
      />
    </Stack>
  );
}
