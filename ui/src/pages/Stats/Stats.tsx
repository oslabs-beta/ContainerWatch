import { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from '@mui/material';

interface DockerStats {
  Container?: string;
  Name: string;
  ID: string;
  CPUPerc: string;
  MemPerc: string;
  MemUsage: string;
  NetIO: string;
  BlockIO: string;
  PIDs: string;
}

const MOCK_STATS: Array<DockerStats> = [
  {
    BlockIO: '46.3MB / 24MB',
    CPUPerc: '4.00%',
    Container: '083cd15faa7f7853f60bde5712b8eb5c87828bbfaa6789ca62681c9632176b59',
    ID: '083cd15faa7f7853f60bde5712b8eb5c87828bbfaa6789ca62681c9632176b59',
    MemPerc: '5.03%',
    MemUsage: '73.77MiB / 3.841GiB',
    Name: 'loving_shannon',
    NetIO: '232MB / 33.9MB',
    PIDs: '25',
  },
  {
    BlockIO: '0B / 2.15MB',
    CPUPerc: '1.00%',
    Container: '1bc20b67e59b65e8ef0007bdc7c6b61e77c3b236e55d47572f85f6cf12d44f51',
    ID: '1bc20b67e59b65e8ef0007bdc7c6b61e77c3b236e55d47572f85f6cf12d44f51',
    MemPerc: '22.5%',
    MemUsage: '40.19MiB / 3.841GiB',
    Name: 'service',
    NetIO: '4.32MB / 25.2kB',
    PIDs: '22',
  },
  {
    BlockIO: '7.86MB / 1.76MB',
    CPUPerc: '20.1%',
    Container: 'e7b85b0e30b5e524649ae52f2633ca61291b411b18d97fb403d1aedd00f0b801',
    ID: 'e7b85b0e30b5e524649ae52f2633ca61291b411b18d97fb403d1aedd00f0b801',
    MemPerc: '31.1%',
    MemUsage: '2.738MiB / 3.841GiB',
    Name: 'docker-tutorial',
    NetIO: '36.4kB / 618kB',
    PIDs: '5',
  },
];

const HEADERS: Array<string> = [
  '',
  'NAME',
  'CPU %',
  'MEM %',
  'MEM USAGE / LIMIT',
  'NET I/O',
  'BLOCK I/O',
  'PIDS',
];

export default function Stats() {
  const [stats, setStats] = useState<Array<DockerStats>>(MOCK_STATS);

  return (
    <TableContainer component={Paper} sx={{ background: 'none', border: 'none' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {HEADERS.map((header) => (
              <TableCell>
                <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row) => (
            <Row {...row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row({ Name, ID, CPUPerc, MemUsage, MemPerc, NetIO, BlockIO, PIDs }: DockerStats) {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <TableRow sx={{ '& td': { border: 'none' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack direction="column" spacing={0.5}>
            <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{Name}</Typography>
            <Typography sx={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }} variant="body2">
              {ID.slice(0, 12)}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="column" spacing={0.5}>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{CPUPerc}</Typography>
            <LinearProgress variant="determinate" value={parseFloat(CPUPerc)} />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="column" spacing={0.5}>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{MemPerc}</Typography>
            <LinearProgress variant="determinate" value={parseFloat(MemPerc)} />
          </Stack>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{MemUsage}</Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{NetIO}</Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{BlockIO}</Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{PIDs}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/*********** This Box is a placeholder for a Graph component ************/}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                border: 'lightgray',
                backgroundColor: 'gray',
                m: 2,
              }}
            >
              <Typography>Graph</Typography>
            </Box>
            {/***********************************************************************/}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
