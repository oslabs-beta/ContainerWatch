import { useEffect, useState, createContext, useContext } from 'react';
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
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import fetchAllContainers from '../../actions/fetchAllContainers';
import fetchAllContainerLogs from '../../actions/fetchAllContainerLogs';
import { DockerLog, DockerContainer, LogFilters } from '../../types';
import { Docker } from '@docker/extension-api-client-types/dist/v1';

const HEADERS = ['', 'Timestamp', 'Container', 'Message'];

// Obtain Docker Desktop client
const client = createDockerDesktopClient();
const useDockerDesktopClient = () => {
  return client;
};

const runningContainers: Record<string, string> = {};

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

  // Populate runningContainers {} with container Id's and state. This is used for assinging container icon color based on running status
  for (let i = 0; i < containers.length; i++) {
    const currentContainer = containers[i];
    const containerId = currentContainer.Id;
    const state = currentContainer.State;
    runningContainers[containerId] = state;
  }

  return (
    <>
      <FilterDrawer
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
  purple[100],
  red[100],
  blue[100],
  teal[100],
  green[100],
  cyan[100],
  orange[100],
  yellow[100],
  brown[100],
  blueGrey[100],
];
// Keeps track of what color to assign to each unique container
let colorCounter = 0;
// Containers object holds key value pairs of {containerName: containerColor}
const containerTracker: Record<string, string> = {};
let containerColor: string;
let containerIconColor: string;

function Row({ containerName, containerId, time, stream, log }: DockerLog) {
  const [open, setOpen] = useState<boolean>(false);

  // Assigning color to container only if its a new container
  if (!containerTracker.hasOwnProperty(containerName)) {
    containerColor = colorArray[colorCounter];
    containerTracker[containerName] = containerColor;
    colorCounter = colorCounter === 9 ? 0 : colorCounter + 1;
  }
  // Assigning color to containerIcon based on running staus
  runningContainers[containerId] === 'running'
    ? (containerIconColor = 'teal')
    : (containerIconColor = 'grey');

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
            <ContainerIcon htmlColor={containerIconColor} sx={{ fontSize: 14 }} />
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontFamily: 'monospace',
                backgroundColor: containerTracker[containerName],
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
