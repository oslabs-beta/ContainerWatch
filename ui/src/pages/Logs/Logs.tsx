import './Logstyles.css';
import {
  List,
  ListItem,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import * as React from 'react';

type Anchor = 'left';

// Define Column interface
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right'; // Feel free to change this to center instead
}

// Defining columns array, readonly just means that it can't be altered after declaration
const columns: readonly Column[] = [
  { id: 'TimeStamp', label: 'TimeStamp', minWidth: 170 },
  { id: 'Container', label: 'Container', minWidth: 100 },
  {
    id: 'Log Messages',
    label: 'Log Messages',
    minWidth: 170,
    align: 'right',
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

export default function drawerOpen() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState([true, false]);

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
    setChecked([event.target.checked, event.target.checked]);
  };
  // Function for checking first box
  const checkContainer1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };
  // Function for checking second box
  const checkContainer2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  // jsx for the container filter section in sidebar
  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label="Container 1"
        control={<Checkbox checked={checked[0]} onChange={checkContainer1} />}
      />
      <FormControlLabel
        label="Container 2"
        control={<Checkbox checked={checked[1]} onChange={checkContainer2} />}
      />
    </Box>
  );

  // Array containing times for the time slider
  const marks = [
    {
      value: 0,
      label: '12:00am',
    },
    {
      value: 20,
      label: '1:00am',
    },
    {
      value: 37,
      label: '2:00am',
    },
    {
      value: 100,
      label: '3:00am',
    },
  ];

  // Displays the time on the slider
  function valuetext(value: number) {
    return `${value}`;
  }

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
    marginLeft: `-240px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
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
          <List>
            <FormControlLabel
              label="Container"
              control={
                <Checkbox
                  checked={checked[0] && checked[1]}
                  indeterminate={checked[0] !== checked[1]}
                  onChange={checkAllContainers}
                />
              }
            />
            {children}
          </List>
          <Divider />
          <List>
            <ListItem>Time Selection</ListItem>
            <Slider
              aria-label="Custom marks"
              defaultValue={20}
              getAriaValueText={valuetext}
              step={10}
              valueLabelDisplay="auto"
              marks={marks}
            />
          </List>
        </Drawer>
        <Main open={open}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        <TableCell align="right">{row.logMessages}</TableCell>
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
