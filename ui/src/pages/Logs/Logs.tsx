import { useEffect, useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Search, Clear, FilterList, Refresh } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Stack,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import RefreshMessage from '../../components/RefreshMessage/RefreshMessage';
import fetchAllContainers from '../../actions/fetchAllContainers';
import fetchAllContainerLogs from '../../actions/fetchAllContainerLogs';
import { DockerLog, DockerContainer, LogFilters } from '../../types';
import { createTheme } from '@mui/material/styles';
import { debounce } from 'lodash';
import { LogsTable } from '../../components/LogsTable/LogsTable';

// Obtain Docker Desktop client
const client = createDockerDesktopClient();
const useDockerDesktopClient = () => {
  return client;
};

// Detecting whether user is in dark or light mode
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
export const theme = createTheme({
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
  const [elapsedTimeInMinutes, setElapsedTimeInMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<LogFilters>({
    stdout: true,
    stderr: true,
    allowedContainers: new Set(),
  });

  useEffect(() => {
    refreshAll();
  }, []);

  // Lodash debounce implementation
  const debouncedSetSearchText = debounce((value) => {
    setSearchText(value);
  }, 400);
  // Clean up debounce functions
  useEffect(() => {
    debouncedSetSearchText.cancel();
  }, [debouncedSetSearchText]);

  // Refreshes logs page fetching all new containers
  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const allContainers = await fetchAllContainers(ddClient);
      const allContainerLogs = await fetchAllContainerLogs(ddClient, allContainers);
      // Added new container and filters are applied
      if (
        allContainers.length > containers.length &&
        (filters.allowedContainers.size < containers.length || !filters.stderr || !filters.stdout)
      ) {
        setFilters({
          ...filters,
          allowedContainers: filters.allowedContainers.add(allContainers[0].Id),
        });
      } // If no new containers but filters are applied
      else if (
        allContainers.length === containers.length &&
        (filters.allowedContainers.size < containers.length || !filters.stdout || !filters.stderr)
      ) {
        setFilters({ ...filters });
      } // On initial render as well as if no new containers as well as no filters applied
      else {
        setFilters({
          stdout: true,
          stderr: true,
          allowedContainers: new Set(allContainers.map(({ Id }) => Id)),
        });
      }
      setContainers(allContainers);
      setLogs(allContainerLogs);
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
      setElapsedTimeInMinutes(0);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

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
      <Box
        sx={{
          minHeight: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" spacing={2} alignContent="center">
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
            onChange={(e) => {
              debouncedSetSearchText(e.target.value);
            }}
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
          <RefreshMessage
            elapsedTimeInMinutes={elapsedTimeInMinutes}
            setElapsedTimeInMinutes={setElapsedTimeInMinutes}
          />
        </Stack>
        {isLoading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <LogsTable
            searchText={searchText}
            filters={filters}
            logs={logs}
            validFromTimestamp={validFromTimestamp}
            validUntilTimestamp={validUntilTimestamp}
            containerLabelColor={containerLabelColor}
            containerIconColor={containerIconColor}
            ddClient={ddClient}
          />
        )}
      </Box>
    </>
  );
}
