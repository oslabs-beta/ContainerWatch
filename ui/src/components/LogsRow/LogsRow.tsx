import { useState } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, ErrorRounded } from '@mui/icons-material';
import { Box, Typography, IconButton, TableCell, TableRow, Collapse } from '@mui/material';
import ContainerIcon from '../ContainerIcon/ContainerIcon';
import { DockerLog, DDClient } from '../../types';
import { HEADERS, theme } from '../../pages/Logs/Logs';

const logsDisplayStyle = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontFamily: 'monospace',
};

export default function LogsRow({
  logInfo: logInfo,
  containerLabelColor,
  containerIconColor,
  ddClient,
}: {
  logInfo: DockerLog;
  containerLabelColor: Record<string, string>;
  containerIconColor: Record<string, string>;
  ddClient: DDClient;
}) {
  const { containerId, containerName, time, stream, log } = logInfo;
  const [open, setOpen] = useState<boolean>(false);
  const [metrics, setMetrics] = useState('');

  const labelColor = containerLabelColor[containerId];
  let iconColor = containerIconColor[containerId] === 'running' ? 'teal' : 'grey';

  // Row opening handler, makes a request to the backend to get data from Prometheus.
  // Parses and displays the data at the time of the log.
  const fetchMetrics = async () => {
    try {
      // POST request to the backend via the ddClient.
      const response: any = await ddClient.extension.vm?.service?.get(
        `/api/promQL?containerID=${containerId}&time=${time.toString()}`
      );

      // If the returned value is a valid metric, show only up to two digits after the decimal.
      Object.keys(response).forEach((el) => {
        if (response[el] !== 'No data') {
          response[el] = parseFloat(response[el]).toFixed(2);
        }
      });

      let newMetricsString = '';
      // Create a display string using the provided response from our backend.
      if (response.CPU === 'No data' && response.MEM === 'No data') {
        newMetricsString = 'There are no metrics saved near the timestamp of this log';
      } else {
        newMetricsString = `Closest metrics datapoint ${time.slice(0, 19)} · CPU %: ${
          response.CPU
        } · MEM %: ${response.MEM}`;
      }

      // Set metrics to display metrics at the time of the log!
      setMetrics(newMetricsString);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TableRow hover sx={{ '& td': { border: 'none', paddingTop: 0, paddingBottom: 0 } }}>
        <TableCell sx={{ p: 0 }}>
          <IconButton size="small" sx={{ background: 'none' }} onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{time.split('.')[0]}</Typography>
        </TableCell>
        <TableCell>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              maxWidth: '150px',
            }}
          >
            <ContainerIcon htmlColor={iconColor} sx={{ fontSize: 14 }} />
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                backgroundColor: labelColor,
                borderRadius: '5px',
                px: 1,
              }}
            >
              {containerName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell
          sx={{
            // The combination of width: 100% and maxWidth: 0 makes the cell grow to fit
            // the horizontal space. The table will not overflow in the x direction.
            width: '100%',
            maxWidth: 0,
          }}
        >
          <Typography sx={logsDisplayStyle}>
            {stream === 'stdout' ? (
              log
            ) : (
              <>
                <ErrorRounded
                  htmlColor="red"
                  sx={{ verticalAlign: 'middle', fontSize: 14, marginRight: 1 }}
                />
                {log}
              </>
            )}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0 }} />
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={HEADERS.length - 1}>
          <Collapse in={open} addEndListener={fetchMetrics} timeout="auto" unmountOnExit>
            <Typography sx={{ display: 'flex', alignContent: 'flex-end', fontSize: '11px', mt: 1 }}>
              {metrics}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                border: 'lightgray',
                backgroundColor: theme.palette.background.default,
                borderRadius: '5px',
                mb: 1,
                px: 1,
              }}
            >
              <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {log || ' '}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
