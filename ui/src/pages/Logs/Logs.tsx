import {
  List,
  ListItem,
  Divider,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  NativeSelect,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Slider,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import * as React from 'react';

// Define Column interface
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left'; // Feel free to change this to center instead
}

// Defining columns array, readonly just means that it can't be altered after declaration
const columns: readonly Column[] = [
  { id: 'TimeStamp', label: 'TimeStamp', minWidth: 170 },
  { id: 'Container', label: 'Container', minWidth: 100 },
  {
    id: 'Log Messages',
    label: 'Log Messages',
    minWidth: 170,
    align: 'left',
  },
];

// Define LogData interface that gets returned when createData function is invoked
interface LogData {
  time: string;
  container: string;
  logMessages: string;
  [key: string]: string;
}

// This function just returns a LogData object with time, container, and logMessages
function createData(
  time: string,
  container: string,
  logMessages: string
): LogData {
  return { time, container, logMessages };
}
// Array of mock data container names
const words = [
  'apple',
  'banana',
  'carrot',
  'dog',
  'elephant',
  'flower',
  'guitar',
  'honey',
  'island',
  'jazz',
  'kangaroo',
  'lemon',
  'monkey',
  'noodle',
  'orange',
];

// Function to generate mock data for now
function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

const rows: LogData[] = [
  createData('10:00 AM', getRandomWord(), 'this is a message'),
  createData('11:30 AM', getRandomWord(), 'this is a message'),
  createData('01:45 PM', getRandomWord(), 'this is a message'),
  createData('02:15 PM', getRandomWord(), 'this is a message'),
  createData('03:30 PM', getRandomWord(), 'this is a message'),
  createData('05:00 PM', getRandomWord(), 'this is a message'),
  createData('06:45 PM', getRandomWord(), 'this is a message'),
  createData('08:15 PM', getRandomWord(), 'this is a message'),
  createData('09:30 PM', getRandomWord(), 'this is a message'),
  createData('10:45 PM', getRandomWord(), 'this is a message'),
  createData('11:30 PM', getRandomWord(), 'this is a message'),
  createData('01:15 AM', getRandomWord(), 'this is a message'),
  createData('03:00 AM', getRandomWord(), 'this is a message'),
  createData('04:45 AM', getRandomWord(), 'this is a message'),
  createData('06:30 AM', getRandomWord(), 'this is a message'),
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function drawerOpen() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [container, setContainer] = React.useState([true, false]);
  const [type, setType] = React.useState([true, false]);
  const [day, setDay] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [time, setTime] = React.useState('');

  // Setting state of open to true
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  // Setting state of open to false
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Function for checking all container boxes
  const checkAllContainers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainer([event.target.checked, event.target.checked]);
  };
  // Function for checking first box
  const checkContainer1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainer([event.target.checked, container[1]]);
  };
  // Function for checking second box
  const checkContainer2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainer([container[0], event.target.checked]);
  };

  // jsx for the container filter section in sidebar
  const containers = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label="Container 1"
        control={<Checkbox checked={container[0]} onChange={checkContainer1} />}
      />
      <FormControlLabel
        label="Container 2"
        control={<Checkbox checked={container[1]} onChange={checkContainer2} />}
      />
    </Box>
  );
  // Function for checking all container boxes
  const checkAllTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([event.target.checked, event.target.checked]);
  };
  // Function for checking first box
  const checkStdout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([event.target.checked, type[1]]);
  };
  // Function for checking second box
  const checkStderr = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([type[0], event.target.checked]);
  };

  const typeLog = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label="stdout"
        control={<Checkbox checked={type[0]} onChange={checkStdout} />}
      />
      <FormControlLabel
        label="stderr"
        control={<Checkbox checked={type[1]} onChange={checkStderr} />}
      />
    </Box>
  );

  //
  const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: '-300px',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    marginRight: '-80px',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - 240px)`,
      marginLeft: `240px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const chooseDay = (event: SelectChangeEvent) => {
    setDay(event.target.value);
  };

  const chooseMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };

  const chooseYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Process Logs
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Typography variant="h6">Log Filters</Typography>
          <Button>Apply Filters</Button>
          <Divider />
          <List>
            <FormControlLabel
              label="Type"
              control={
                <Checkbox
                  checked={type[0] && type[1]}
                  indeterminate={type[0] !== type[1]}
                  onChange={checkAllTypes}
                />
              }
            />
            {typeLog}
          </List>
          <Divider />
          <List>
            <FormControlLabel
              label="Container"
              control={
                <Checkbox
                  checked={container[0] && container[1]}
                  indeterminate={container[0] !== container[1]}
                  onChange={checkAllContainers}
                />
              }
            />
            {containers}
          </List>
          <Divider />
          <List>
            <ListItem>Time Selection</ListItem>
            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="timeTextbox">Time</InputLabel>
              <BootstrapInput id="timeTextbox" />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel id="day">Day</InputLabel>
              <Select
                labelId="daymenu"
                id="daymenu"
                value={day}
                onChange={chooseDay}
                input={<BootstrapInput />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'Monday'}>Monday</MenuItem>
                <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
                <MenuItem value={'Thursday'}>Thursday</MenuItem>
                <MenuItem value={'Friday'}>Friday</MenuItem>
                <MenuItem value={'Saturday'}>Saturday</MenuItem>
                <MenuItem value={'Sunday'}>Sunday</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel id="month">Month</InputLabel>
              <Select
                labelId="monthmenu"
                id="monthmenu"
                value={month}
                onChange={chooseMonth}
                input={<BootstrapInput />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'January'}>January</MenuItem>
                <MenuItem value={'February'}>February</MenuItem>
                <MenuItem value={'March'}>March</MenuItem>
                <MenuItem value={'April'}>April</MenuItem>
                <MenuItem value={'May'}>May</MenuItem>
                <MenuItem value={'June'}>June</MenuItem>
                <MenuItem value={'July'}>July</MenuItem>
                <MenuItem value={'August'}>August</MenuItem>
                <MenuItem value={'September'}>September</MenuItem>
                <MenuItem value={'October'}>October</MenuItem>
                <MenuItem value={'November'}>November</MenuItem>
                <MenuItem value={'December'}>December</MenuItem>
              </Select>
            </FormControl>
          </List>
        </Drawer>
        <Main open={open}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '100%' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.container}
                      >
                        <TableCell align="left">{row.time}</TableCell>
                        <TableCell align="left">{row.container}</TableCell>
                        <TableCell align="left">{row.logMessages}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Main>
      </Box>
    </>
  );
}
