import { useEffect, useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import {
  Search,
  Clear,
  FilterList,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Refresh,
  ErrorRounded,
} from '@mui/icons-material';
import {
  purple,
  red,
  blue,
  teal,
  green,
  cyan,
  orange,
  yellow,
  brown,
  blueGrey,
} from '@mui/material/colors';
import {
  Box,
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  useTheme,
} from '@mui/material';
import ContainerIcon from '../../components/ContainerIcon/ContainerIcon';
import SideBar from '../../components/Sidebar/Sidebar';
import fetchAllContainers from '../../actions/fetchAllContainers';
import fetchAllContainerLogs from '../../actions/fetchAllContainerLogs';
import { DockerLog, DockerContainer, LogFilters } from '../../types';

const HEADERS = ['', 'Timestamp', 'Container', 'Message'];

// Obtain Docker Desktop client
const client = createDockerDesktopClient();
const useDockerDesktopClient = () => {
  return client;
};

export default function Logs() {
  // Access the custom theme (provided by DockerMuiThemeProvider)
  const theme = useTheme();

  const ddClient = useDockerDesktopClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [logs, setLogs] = useState<DockerLog[]>([]);
  const [searchText, setSearchText] = useState('');
  const [validFromTimestamp, setValidFromTimestamp] = useState('');
  const [validUntilTimestamp, setValidUntilTimestamp] = useState('');

  const [filters, setFilters] = useState<LogFilters>({
    stdout: true,
    stderr: true,
    allowedContainers: new Set(),
  });

  useEffect(() => {
    refreshAll();
  }, []);

  // Refreshes logs page fetching all new containers
  const refreshAll = async () => {
    try {
      const allContainers = await fetchAllContainers(ddClient);
      const allContainerLogs = await fetchAllContainerLogs(ddClient, allContainers);
      setContainers(allContainers);
      setLogs(allContainerLogs);
      setFilters({ ...filters, allowedContainers: new Set(allContainers.map(({ Id }) => Id)) });
    } catch (err) {
      console.error(err);
    }
  };

  // Apply the filters
  const filteredLogs = logs.filter(({ containerName, containerId, time, stream, log }) => {
    if (!filters.stdout && stream === 'stdout') return false; // Filter out stdout
    if (!filters.stderr && stream === 'stderr') return false; // Filter out stderr
    if (!filters.allowedContainers.has(containerId)) return false; // Filter out containers
    const convertTime = time.slice(0, time.indexOf('.') + 4);
    const numTime = Date.parse(convertTime);
    const numFromTime = Date.parse(validFromTimestamp);
    const numUntilTime = Date.parse(validUntilTimestamp);
    if (numTime > numUntilTime || numTime < numFromTime) return false;
    return true;
  });

  return (
    <>
      <SideBar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        containers={containers}
        filters={filters}
        setFilters={setFilters}
        setValidFromTimestamp={setValidFromTimestamp}
        setValidUntilTimestamp={setValidUntilTimestamp}
      />
      <Box sx={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={2}>
          <OutlinedInput
            placeholder="Search"
            size="small"
            sx={{ width: '50%' }}
            startAdornment={
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <Clear
                  fontSize="small"
                  // Use visibility instead of conditional rendering (`searchText && <InputAdornment>`)
                  // so that the width of the <OutlinedInput> does not change.
                  sx={{ cursor: 'pointer', visibility: searchText ? 'visible' : 'hidden' }}
                  onClick={() => setSearchText('')}
                />
              </InputAdornment>
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setDrawerOpen(true);
            }}
          >
            <FilterList />
          </IconButton>
          <IconButton onClick={refreshAll}>
            <Refresh />
          </IconButton>
        </Stack>

        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            flexGrow: 1,
            background: 'none',
            border: 'none',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {HEADERS.map((header) => (
                  <TableCell>
                    <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((row) => (
                <Row {...row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
const logsDisplayStyle = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontFamily: 'monospace',
};

const colorArray: string[] = [
  purple[300],
  red[300],
  blue[300],
  teal[300],
  green[300],
  cyan[300],
  orange[300],
  yellow[300],
  brown[300],
  blueGrey[300],
];
// Keeps track of what color to assign to each unique container
let colorCounter = 0;
// Containers object holds key value pairs of {containerName: containerColor}
const containers: Record<string, string> = {};
let containerColor: string;

function Row({ containerName, containerId, time, stream, log }: DockerLog) {
  const [open, setOpen] = useState<boolean>(false);
  // Assigning color to container only if its a new container
  if (!containers.hasOwnProperty(containerName)) {
    containerColor = colorArray[colorCounter];
    containers[containerName] = containerColor;
    colorCounter = colorCounter === 9 ? 0 : colorCounter + 1;
  }

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
            <ContainerIcon htmlColor={containers[containerName]} sx={{ fontSize: 14 }} />
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontFamily: 'monospace',
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
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: 'flex',
                border: 'lightgray',
                backgroundColor: 'black',
                borderRadius: '5px',
                paddingTop: 0.5,
                paddingBottom: 0.5,
                paddingLeft: 1,
                paddingRight: 1,
                marginTop: 1,
                marginBottom: 1,
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
