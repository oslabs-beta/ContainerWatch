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
  CircularProgress,
} from '@mui/material';
import { useStats, DockerStats } from '../../hooks/useStats';

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
  const stats = useStats();

  return stats ? (
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
  ) : (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={HEADERS.length}>
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
