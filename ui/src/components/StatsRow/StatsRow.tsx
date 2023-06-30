import { useState } from 'react';
import { DockerStats } from '../../hooks/useStats';
import {
  TableRow,
  TableCell,
  Stack,
  Typography,
  IconButton,
  LinearProgress,
  Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import StatsGraph from '../StatsGraph/StatsGraph';
import { HEADERS } from '../../pages/Stats/Stats';

export default function StatsRow(props: any) {
  const [open, setOpen] = useState<boolean>(false);
  const { rowStats } = props;
  const { Name, ID, CPUPerc, MemUsage, MemPerc, NetIO, BlockIO, PIDs }: DockerStats = rowStats;

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
            <StatsGraph containerName={Name} containerID={ID} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
