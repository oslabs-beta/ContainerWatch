import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useStats, DockerStats } from '../../hooks/useStats';
import StatsRow from '../../components/StatsRow/StatsRow';

export const HEADERS: Array<string> = [
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
          {stats.map((row: DockerStats) => (
            <StatsRow rowStats={row} />
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
