type StatsGraphProps = {
  panelID: number;
  containerID: string;
};
export default function StatsGraph({ panelID, containerID }: StatsGraphProps) {
  return (
    <iframe
      src={`http://localhost:2999/d-solo/${containerID}/${containerID}?orgId=1&refresh=15s&panelId=${panelID}`}
      width="100%"
      height="200"
    />
  );
}
