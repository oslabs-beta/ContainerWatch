// This file contains code for loading the Process Logs page
import {
  Box,
  FormControl,
  InputLabel,
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import SideBar from '../../components/Sidebar/Sidebar';

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

//
export default function ProcessLogs() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel>Search...</InputLabel>
          <OutlinedInput
            id="search-outline"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>{<SearchIcon />}</IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <SideBar />
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
      </Box>
    </>
  );
}

//export default ProcessLogs;
