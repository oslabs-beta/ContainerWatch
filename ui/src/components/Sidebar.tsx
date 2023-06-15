// This file contains the code for the sidebar
import {
  List,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Drawer,
  Divider,
  Typography,
} from '@mui/material';

import * as React from 'react';

type Anchor = 'left';
// SideBar component
export const SideBar: React.FC = () => {
  const [container, setContainer] = React.useState([true, false]);
  const [type, setType] = React.useState([true, false]);

  const [toggle, setToggle] = React.useState({ left: false });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setToggle({ ...toggle, [anchor]: open });
    };

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

  return (
    <>
      <Button sx={{ position: 'fixed' }} onClick={toggleDrawer('left', true)}>
        Filters
      </Button>
      <Drawer
        anchor="left"
        open={toggle['left']}
        onClose={toggleDrawer('left', false)}
      >
        <Box role="presentation">
          <Typography variant="h6">Filters</Typography>
          <Button onClick={toggleDrawer('left', false)}>Apply Filters</Button>
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
                control={
                  <Checkbox checked={container[0]} onChange={checkContainer1} />
                }
              />
              <FormControlLabel
                label="Container 2"
                control={
                  <Checkbox checked={container[1]} onChange={checkContainer2} />
                }
              />
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
