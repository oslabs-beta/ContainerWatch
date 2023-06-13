import { TextField } from '@mui/material';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

//Define Column interface
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right'; //feel free to change this to center instead
}

// defining columns array, readonly just means that it can't be altered after declaration
const columns: readonly Column[] = [
  { id: 'TimeStamp', label: 'TimeStamp', minWidth: 170 },
  { id: 'Container', label: 'Container', minWidth: 100 },
  {
    id: 'Log Messages',
    label: 'Log Messages',
    minWidth: 170,
    align: 'right', //feel free to change this to center
  },
];

//Define LogData interface that gets returned when createData function is invoked
interface LogData {
  time: string;
  container: string;
  logMessages: string;
  [key: string]: string;
}

//this function just returns a LogData object with time, container, and logMessages
function createData(
  time: string,
  container: string,
  logMessages: string,
 
): LogData {
  return { time, container, logMessages };
}
//array of mock data container names
const words = ['apple', 'banana', 'carrot', 'dog', 'elephant', 'flower', 'guitar', 'honey', 'island', 'jazz', 'kangaroo', 'lemon', 'monkey', 'noodle', 'orange'];

//function to generate mock data for now
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

export default function Logs() {
  const [page, setPage] = React.useState(0); //boilerplate from mui docs sample
  const [rowsPerPage, setRowsPerPage] = React.useState(10); //boilerplate from mui docs sample
  
  const handleChangePage = (event: unknown, newPage: number) => { //boilerplate from mui docs sample
    setPage(newPage);
  };
  //boilerplate from mui docs sample
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setPage(0);
  };
  return (
    <>
      <TextField id="filter-searchbar" label="Filter Logs Here" variant="outlined" />
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.container}>
                    <TableCell align="left">{row.time}</TableCell>
                    <TableCell align="left">{row.container}</TableCell>
                    <TableCell align="right">{row.logMessages}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
    ); 
  };
    