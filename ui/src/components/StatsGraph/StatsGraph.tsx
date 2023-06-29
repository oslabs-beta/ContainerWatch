type StatsGraphProps = {
  containerName: string;
  containerID: string;
};
export default function StatsGraph({ containerName, containerID }: StatsGraphProps) {
  return (
    <>
      <iframe
        src={`http://localhost:2999/d-solo/${containerID.slice(
          0,
          12
        )}/${containerName}?orgId=1&refresh=15s&panelId=1`}
        width="100%"
        height="200"
      />
      <iframe
        src={`http://localhost:2999/d-solo/${containerID.slice(
          0,
          12
        )}/${containerName}?orgId=1&refresh=15s&panelId=2`}
        width="100%"
        height="200"
      />
    </>
  );
}
