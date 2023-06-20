// This file contains the code for the sidebar
import {
  List,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Drawer,
  Divider,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import * as React from 'react';

type SideBarProps = {
  drawerOpen: boolean;
  setDrawerOpen: Function;
};

export default function SideBar({ drawerOpen, setDrawerOpen }: SideBarProps) {
  const [container, setContainer] = React.useState([true, false]);
  const [type, setType] = React.useState([true, false]);
  const [hoursAgo, setHoursAgo] = React.useState('');
  const [upUntil, setUpUntil] = React.useState('');

  /************ Code for time filters in the sidebar ************/
  // Function for setting hoursAgo state for time filter
  const hoursFrom = (e: SelectChangeEvent) => {
    setHoursAgo(e.target.value as string);
  };

  // Function for setting upUntil state for time filter
  const hoursTo = (e: SelectChangeEvent) => {
    setUpUntil(e.target.value as string);
  };

  // Function for generating hours list for time filter drop down  menus
  const generateHours = (): JSX.Element[] => {
    const hours: JSX.Element[] = [];
    for (let i = 1; i <= 72; i++) {
      hours.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return hours;
  };

  // Declaring variable to use for time menu
  const hours: JSX.Element[] = generateHours();
  /************ ************/

  /******** Container filter code ************/
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
  /********* **********/

  /******** Type filter code ************/
  // Function for checking all type boxes
  const checkAllTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([event.target.checked, event.target.checked]);
  };
  // Function for checking Stdout box
  const checkStdout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([event.target.checked, type[1]]);
  };
  // Function for checking Stderr box
  const checkStderr = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType([type[0], event.target.checked]);
  };
  /********* **********/

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box role="presentation" sx={{ width: '250px' }}>
        <Typography variant="h6">Filters</Typography>
        {/* <Button onClick={setDrawerOpen(false)}>Apply Filters</Button> */}
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
        </List>
        <Divider />
        <Typography variant="subtitle1">Time Filter</Typography>
        <FormControl fullWidth>
          <InputLabel id="hoursago">Hours Ago</InputLabel>
          <Select
            labelId="hoursAgoLabel"
            id="hoursAgoId"
            value={hoursAgo}
            label="HoursAgo"
            onChange={hoursFrom}
          >
            {hours}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="hoursto">Hours To</InputLabel>
          <Select
            labelId="hoursToLabel"
            id="hoursToId"
            value={upUntil}
            label="HoursTo"
            onChange={hoursTo}
          >
            {hours}
          </Select>
        </FormControl>
      </Box>
    </Drawer>
  );
}
