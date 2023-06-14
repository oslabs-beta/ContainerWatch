import './Logstyles.css';
import {
  List,
  ListItem,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
} from '@mui/material';
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
  const [state, setState] = React.useState({ left: false });
  const [checked, setChecked] = React.useState([true, false]);

  const anchor = 'left';

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, left: open });
    };

  const checkAllContainers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const checkContainer1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const checkContainer2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

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

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
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
    </Box>
  );
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

  return (
    <>
      <div className="parentDiv">
        <div className="left-div">
          <React.Fragment key="left">
            <Button onClick={toggleDrawer(true)}>Filters</Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        </div>
        <div className="right-div">
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
        </div>
      </div>
    </>
  );
}
