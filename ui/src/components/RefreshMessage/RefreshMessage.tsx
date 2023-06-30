import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

type RefreshMessageProps = {
  elapsedTimeInMinutes: number;
  setElapsedTimeInMinutes: React.Dispatch<React.SetStateAction<number>>;
};
export default function RefreshMessage({
  elapsedTimeInMinutes,
  setElapsedTimeInMinutes,
}: RefreshMessageProps) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTimeInMinutes((prevElapsedTime) => prevElapsedTime + 1);
    }, 60000);

    // Manually trigger to prevent delays or speed ups due to render time of useEffect
    setElapsedTimeInMinutes((prevElapsedTime) => prevElapsedTime + 1);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  let message;
  if (elapsedTimeInMinutes < 60) {
    message = `Last refreshed ${elapsedTimeInMinutes}m ago`;
  } else {
    const elapsedHours = Math.floor(elapsedTimeInMinutes / 60);
    const remainingMinutes = elapsedTimeInMinutes % 60;
    const formattedTime = `${elapsedHours}h ${remainingMinutes}m`;
    message = `Last refreshed ${formattedTime} ago`;
  }

  return (
    <Stack justifyContent={'center'}>
      <Typography variant="caption">{message}</Typography>
    </Stack>
  );
}
