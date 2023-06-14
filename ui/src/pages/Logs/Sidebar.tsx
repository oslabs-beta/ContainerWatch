// This file contains the code for the sidebar
import {
  List,
  ListItem,
  Divider,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Drawer,
  Toolbar,
  Typography,
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

// Function for the search bar in the appBar
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

// Function for the magnify glass icon in the search bar
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Function for the users input in the search bar
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

// SideBar component
export const SideBar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [container, setContainer] = React.useState([true, false]);
  const [type, setType] = React.useState([true, false]);
  const [day, setDay] = React.useState('');
  const [month, setMonth] = React.useState('');

  /******* These two functions handle the state for opening and closing the sidebar *******/
  // Sets state open to true
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  // Sets state open to false
  const handleDrawerClose = () => {
    setOpen(false);
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

  // Container filter section in sidebar
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

  // Type log section in sidebar
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

  // Defining prop types for the AppBar component, allowing us to customize/add the open prop on top of the built in MuiAppBarProps
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  // Styling for the Appbar that displays "Process Logs" and the search bar
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

  // Styling for drawer button and back button
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  // Function for Day menu in sidebar
  const chooseDay = (event: SelectChangeEvent) => {
    setDay(event.target.value);
  };

  // Function for Month menu in sidebar
  const chooseMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };

  // Styling for the drop down menus used for time filtering
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
    </>
  );
};

export default SideBar;
