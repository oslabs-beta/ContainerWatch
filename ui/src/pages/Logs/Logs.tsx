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
} from '@mui/material';
import ContainerIcon from '../../components/ContainerIcon/ContainerIcon';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import fetchAllContainers from '../../actions/fetchAllContainers';
import fetchAllContainerLogs from '../../actions/fetchAllContainerLogs';
import { DockerLog, DockerContainer, LogFilters } from '../../types';
import { createTheme } from '@mui/material/styles';

const HEADERS = ['', 'Timestamp', 'Container', 'Message'];

// Obtain Docker Desktop client
const client = createDockerDesktopClient();
const useDockerDesktopClient = () => {
  return client;
};

// Detecting whether user is in dark or light mode
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = createTheme({
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
    background: {
      default: prefersDarkMode ? '#121212' : '#fff',
    },
    primary: {
      main: prefersDarkMode ? '#1769aa' : '#4dabf5',
      light: prefersDarkMode ? '#482880' : '#8561c5',
      dark: prefersDarkMode ? '#00695f' : '#33ab9f',
    },
    secondary: {
      main: prefersDarkMode ? '#a31545' : '#ed4b82',
      light: prefersDarkMode ? '#b26a00' : '#ffac33',
      dark: prefersDarkMode ? '#357a38' : '#6fbf73',
    },
  },
});

// Colors available for container labels
const colorArray: string[] = [
  theme.palette.primary.main,
  theme.palette.primary.light,
  theme.palette.primary.dark,
  theme.palette.secondary.main,
  theme.palette.secondary.light,
  theme.palette.secondary.dark,
];

export default function Logs() {
  const ddClient = useDockerDesktopClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [logs, setLogs] = useState<DockerLog[]>([]);
  const [searchText, setSearchText] = useState('');
  const [validFromTimestamp, setValidFromTimestamp] = useState('');
  const [validUntilTimestamp, setValidUntilTimestamp] = useState('');
  const [containerLabelColor, setContainerLabelColor] = useState<Record<string, string>>({});
  const [containerIconColor, setContainerIconColor] = useState<Record<string, string>>({});
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
      const updatedContainerLabelColor = allContainers.reduce(
        (prevContainerLabelColor, container, index) => ({
          ...prevContainerLabelColor,
          [container.Id]: colorArray[index % colorArray.length],
        }),
        {}
      );
      setContainerLabelColor(updatedContainerLabelColor);
      const updatedContainerIconColor = allContainers.reduce(
        (prevContainerIconColor, container) => ({
          ...prevContainerIconColor,
          [container.Id]: container.State,
        }),
        {}
      );
      setContainerIconColor(updatedContainerIconColor);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply the filters
  const upperCaseSearchText = searchText.toUpperCase();
  const filteredLogs = logs.filter(({ containerName, containerId, time, stream, log }) => {
    if (!filters.stdout && stream === 'stdout') return false; // Filter out stdout
    if (!filters.stderr && stream === 'stderr') return false; // Filter out stderr
    if (!filters.allowedContainers.has(containerId)) return false; // Filter out containers
    const convertTime = time.slice(0, time.indexOf('.') + 4);
    const numTime = Date.parse(convertTime);
    const numFromTime = Date.parse(validFromTimestamp);
    const numUntilTime = Date.parse(validUntilTimestamp);
    if (!log.toUpperCase().includes(upperCaseSearchText)) return false;
    if (numTime > numUntilTime || numTime < numFromTime) return false;
    return true;
  });

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
        containerLabelColor={containerLabelColor}
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
              {filteredLogs.map((logInfo) => (
                <Row
                  logInfo={logInfo}
                  containerLabelColor={containerLabelColor}
                  containerIconColor={containerIconColor}
                />
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

function Row({
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

  const labelColor = containerLabelColor[containerId];
  let iconColor = containerIconColor[containerId] === 'running' ? 'teal' : 'grey';

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
          <Collapse in={open} timeout="auto" unmountOnExit>
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
