import { useEffect, useState } from 'react';
import {
  Search,
  Clear,
  FilterList,
  KeyboardArrowUp,
  KeyboardArrowDown,
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
  useTheme,
} from '@mui/material';
import ContainerIcon from '../../components/ContainerIcon/ContainerIcon';
import SideBar from '../../components/Sidebar/Sidebar';
import fetchAllContainerLogs, {
  DockerLog,
} from '../../actions/fetchAllContainerLogs';

const HEADERS = ['', 'Timestamp', 'Container', 'Message'];

export default function Logs() {
  // Access the custom theme (provided by DockerMuiThemeProvider)
  const theme = useTheme();
  const [type, setType] = useState([true, true]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<DockerLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<DockerLog[]>(logs);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAllContainerLogs().then((allLogs) => {
      setLogs(allLogs);
      setFilteredLogs(allLogs);
    });
  }, []);

  useEffect(() => {
    if (JSON.stringify(type) === JSON.stringify([true, false])) {
      fetchAllContainerLogs('stdout').then((allLogs) => {
        setLogs(allLogs);
        setFilteredLogs(allLogs);
        console.log('only stdout');
      });
    } else if (JSON.stringify(type) === JSON.stringify([false, true])) {
      fetchAllContainerLogs(undefined, 'stderr').then((allLogs) => {
        setLogs(allLogs);
        setFilteredLogs(allLogs);
        console.log('only stout');
      });
    } else if (JSON.stringify(type) === JSON.stringify([false, false])) {
      fetchAllContainerLogs(undefined, undefined, 'off').then((allLogs) => {
        setLogs(allLogs);
        setFilteredLogs(allLogs);
      });
    } else {
      fetchAllContainerLogs().then((allLogs) => {
        setLogs(allLogs);
        setFilteredLogs(allLogs);
      });
    }
  }, type);

  return (
    <>
      <SideBar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        type={type}
        setType={setType}
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
                  sx={{
                    cursor: 'pointer',
                    visibility: searchText ? 'visible' : 'hidden',
                  }}
                  onClick={() => setSearchText('')}
                />
              </InputAdornment>
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton
            onClick={(e) => {
              console.log('click');
              e.stopPropagation();
              setDrawerOpen(true);
            }}
          >
            <FilterList />
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
                    <Typography
                      sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}
                    >
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

function Row({ containerName, containerId, time, stream, log }: DockerLog) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TableRow
        hover
        sx={{ '& td': { border: 'none', paddingTop: 0, paddingBottom: 0 } }}
      >
        <TableCell sx={{ p: 0 }}>
          <IconButton
            size="small"
            sx={{ background: 'none' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{time}</Typography>
        </TableCell>
        <TableCell>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* TODO: access the custom theme colors instead of hardcoding the color */}
            <ContainerIcon htmlColor="#228375" />
            <Typography>{containerName}</Typography>
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
          <Typography
            sx={{
              // Logs will be cut off with an ellipsis instead of wrapping or overflowing.
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              fontFamily: 'monospace',
            }}
          >
            {log}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0 }} />
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={HEADERS.length - 1}
        >
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
