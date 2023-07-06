import { useState } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, ErrorRounded } from '@mui/icons-material';
import { Box, Typography, IconButton, TableCell, TableRow, Collapse } from '@mui/material';
import ContainerIcon from '../ContainerIcon/ContainerIcon';
import { DockerLog, DDClient } from '../../types';
import { theme } from '../../pages/Logs/Logs';

const logsDisplayStyle = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontFamily: 'monospace',
};

type LogsRowProps = {
  logInfo: DockerLog;
  containerLabelColor: Record<string, string>;
  containerIconColor: Record<string, string>;
  ddClient: DDClient;
  headers: string[];
};

export default function LogsRow({
  logInfo: logInfo,
  containerLabelColor,
  containerIconColor,
  ddClient,
  headers,
}: LogsRowProps) {
  const { containerId, containerName, time, stream, log } = logInfo;
  const [open, setOpen] = useState<boolean>(false);
  const [CPU, setCPU] = useState('');
  const [MEM, setMEM] = useState('');

  const labelColor = containerLabelColor[containerId];
  let iconColor = containerIconColor[containerId] === 'running' ? 'teal' : 'grey';

  // Row opening handler, makes a request to the backend to get data from Prometheus.
  // Sets CPU and MEM states upon receiving a response from the backend.
  const fetchMetrics = async () => {
    try {
      // POST request to the backend via the ddClient.
      const response: any = await ddClient.extension.vm?.service?.get(
        `/api/promQL?containerID=${containerId}&time=${time}`
      );

      // If the returned value is a valid metric, show only up to two digits after the decimal.
      // Then set state of CPU and MEM to the response.
      Object.keys(response).forEach((el) => {
        if (response[el] !== 'No data') {
          response[el] = parseFloat(response[el]).toFixed(2);
        }
        switch (el) {
          case 'CPU': {
            setCPU(response[el]);
            break;
          }
          case 'MEM': {
            setMEM(response[el]);
            break;
          }
          default: {
            console.log(
              'Response from the backend should never return a key that is not listed in the cases!'
            );
            break;
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Build a row component that sits above the logs.
  // If CPU or MEM have data, return a formatted string with metric categories highlighted in green.
  // Otherwise, return a row that simply displays that there are no metrics at the timestamp.
  const buildMetricsRow = () => {
    if (CPU !== 'No data' || MEM !== 'No data') {
      return (
        <Box sx={{ display: 'flex', alignContent: 'flex-end', fontSize: '11px', mt: 1 }}>
          <Typography>Closest metrics datapoint {time.slice(0, 19)} ·</Typography>
          <Typography sx={{ color: 'green' }}>CPU %:</Typography>
          <Typography>{CPU} ·</Typography>
          <Typography sx={{ color: 'green' }}>MEM %:</Typography>
          <Typography>{MEM}</Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignContent: 'flex-end', fontSize: '11px', mt: 1 }}>
          <Typography>There are no metrics saved near the timestamp of this log</Typography>
        </Box>
      );
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length - 1}>
          <Collapse in={open} addEndListener={fetchMetrics} timeout="auto" unmountOnExit>
            {buildMetricsRow()}
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
