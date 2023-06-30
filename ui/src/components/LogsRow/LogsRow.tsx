import { useState } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, ErrorRounded } from '@mui/icons-material';
import { Box, Typography, IconButton, TableCell, TableRow, Collapse } from '@mui/material';
import ContainerIcon from '../ContainerIcon/ContainerIcon';
import { DockerLog } from '../../types';
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
}: {
  logInfo: DockerLog;
  containerLabelColor: Record<string, string>;
  containerIconColor: Record<string, string>;
}) {
  const { containerId, containerName, time, stream, log } = logInfo;
  const [open, setOpen] = useState<boolean>(false);
  const [dummyData, setDummyData] = useState('');

  const labelColor = containerLabelColor[containerId];
  let iconColor = containerIconColor[containerId] === 'running' ? 'teal' : 'grey';

  const fetchMetrics = () => {
    // Skeleton for response
    // const response = await fetch(`/metrics/${containerId}`);
    const dumbData = 'CPU:3%, RAM:15MB';
    setDummyData(dumbData);
    console.log('im working');
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
                fontFamily: 'monospace',
                backgroundColor: labelColor,
                borderRadius: '5px',
                padding: 0.5,
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
            <Typography sx={{ display: 'flex', fontSize: '11px' }}>{dummyData}</Typography>
            <Box
              sx={{
                display: 'flex',
                border: 'lightgray',
                backgroundColor: theme.palette.background.default,
                borderRadius: '5px',
                paddingTop: 0.5,
                paddingBottom: 0.5,
                paddingLeft: 1,
                paddingRight: 1,
                marginTop: 1,
                marginBottom: 1,
                alignItems: 'center',
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
