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
import { DockerContainer, LogFilters } from '../../types';

import * as React from 'react';

type SideBarProps = {
  containers: DockerContainer[];
  filters: LogFilters;
  setFilters: React.Dispatch<React.SetStateAction<LogFilters>>;
  drawerOpen: boolean;
  setDrawerOpen: Function;
};

export default function SideBar({
  containers,
  filters,
  setFilters,
  drawerOpen,
  setDrawerOpen,
}: SideBarProps) {
  const [hoursAgo, setHoursAgo] = React.useState('');
  const [upUntil, setUpUntil] = React.useState('');

  const hoursFrom = (e: SelectChangeEvent) => {
    setHoursAgo(e.target.value as string);
  };

  const hoursTo = (e: SelectChangeEvent) => {
    setUpUntil(e.target.value as string);
  };

  const generateHours = (): JSX.Element[] => {
    const hours: JSX.Element[] = [];
    for (let i = 1; i <= 72; i++) {
      hours.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return hours;
  };

  const hours: JSX.Element[] = generateHours();

  const checkAllContainers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allContainerIds = containers.map(({ Id }) => Id);
    setFilters({
      ...filters,
      allowedContainers: event.target.checked ? new Set(allContainerIds) : new Set(),
    });
  };

  const checkContainer = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    // Create a copy
    const newAllowedContainers = new Set(filters.allowedContainers);

    if (event.target.checked) newAllowedContainers.add(id);
    else newAllowedContainers.delete(id);

    setFilters({
      ...filters,
      allowedContainers: newAllowedContainers,
    });
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box role="presentation" sx={{ width: '250px' }}>
        <Typography variant="h6">Filters</Typography>
        <Divider />
        <List>
          <FormControlLabel
            label="Log type"
            control={
              <Checkbox
                checked={filters.stdout && filters.stderr}
                indeterminate={filters.stdout !== filters.stderr}
                onChange={(event) => {
                  setFilters({
                    ...filters,
                    stderr: event.target.checked,
                    stdout: event.target.checked,
                  });
                }}
              />
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
              label="stdout"
              control={
                <Checkbox
                  checked={filters.stdout}
                  onChange={(event) =>
                    setFilters({
                      ...filters,
                      stdout: event.target.checked,
                    })
                  }
                />
              }
            />
            <FormControlLabel
              label="stderr"
              control={
                <Checkbox
                  checked={filters.stderr}
                  onChange={(event) =>
                    setFilters({
                      ...filters,
                      stderr: event.target.checked,
                    })
                  }
                />
              }
            />
          </Box>
        </List>
        <Divider />
        <List>
          <FormControlLabel
            label="Containers"
            control={
              <Checkbox
                checked={filters.allowedContainers.size === containers.length}
                indeterminate={
                  filters.allowedContainers.size !== 0 &&
                  filters.allowedContainers.size !== containers.length
                }
                onChange={checkAllContainers}
              />
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {containers.map(({ Names, Id }) => (
              <FormControlLabel
                label={Names}
                control={
                  <Checkbox
                    checked={filters.allowedContainers.has(Id)}
                    onChange={(event) => checkContainer(event, Id)}
                  />
                }
              />
            ))}
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
