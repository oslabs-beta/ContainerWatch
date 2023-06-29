import { useState } from 'react';
import { Launch } from '@mui/icons-material';
import {
  List,
  Box,
  Stack,
  Checkbox,
  TextField,
  FormControlLabel,
  Drawer,
  Divider,
  Typography,
  Link,
} from '@mui/material';
import { DockerContainer, LogFilters } from '../../types';
import { string } from 'prop-types';

type FilterDrawerProps = {
  containers: DockerContainer[];
  filters: LogFilters;
  setFilters: React.Dispatch<React.SetStateAction<LogFilters>>;
  drawerOpen: boolean;
  setDrawerOpen: Function;
  setValidFromTimestamp: React.Dispatch<React.SetStateAction<string>>;
  setValidUntilTimestamp: React.Dispatch<React.SetStateAction<string>>;
  containerLabelColor: Record<string, string>;
};

export default function FilterDrawer({
  containers,
  filters,
  setFilters,
  drawerOpen,
  setDrawerOpen,
  setValidFromTimestamp,
  setValidUntilTimestamp,
}: FilterDrawerProps) {
  // These represent user input of time regardless of validity
  const [fromTimestamp, setFromTimestamp] = useState('');
  const [untilTimestamp, setUntilTimestamp] = useState('');

  let timeoutID: ReturnType<typeof setTimeout>;
  // Debounce function
  const debounce = (value: any, check: boolean = true) => {
    clearTimeout(timeoutID);
    if (value !== '' && check === false) {
      console.log('false');
      timeoutID = setTimeout(() => setValidFromTimestamp(value), 1500);
    } else if (value !== '' && check === true) {
      console.log('true');
      timeoutID = setTimeout(() => setValidUntilTimestamp(value), 1500);
    }
  };

  // TODO: Refactored debounce function using ternary operators
  // const debounce = (value: any, check: boolean) => {
  //   clearTimeout(timeoutID);
  //   if (value !== '') {
  //     console.log(check ? 'true' : 'false');
  //     timeoutID = setTimeout(() => {
  //       check === true ? setValidFromTimestamp(value) : setValidUntilTimestamp(value);
  //     }, 4000);
  //   }
  // };

  // TODO: Refactored debounce function using different if else structure
  // const debounce = (value: any, check: boolean) => {
  //   clearTimeout(timeoutID);
  //   if (value !== '') {
  //     timeoutID = setTimeout(() => {
  //       if (check) {
  //         setValidFromTimestamp(value);
  //       } else {
  //         setValidUntilTimestamp(value);
  //       }
  //     }, 4000);
  //   }
  // };

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

  const isTimestampValid = (value: string) => {
    return !Number.isNaN(Date.parse(value));
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box
        sx={{
          p: 2,
          width: '250px',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Typography variant="h3">Filters</Typography>
        <List>
          <FormControlLabel
            label="Log type"
            control={
              <Checkbox
                size="small"
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
                  size="small"
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
                  size="small"
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
                size="small"
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
                label={
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      fontFamily: 'monospace',
                    }}
                  >
                    {Names[0].replace(/^\//, '')}
                  </Typography>
                }
                control={
                  <Checkbox
                    size="small"
                    checked={filters.allowedContainers.has(Id)}
                    onChange={(event) => checkContainer(event, Id)}
                  />
                }
              />
            ))}
          </Box>
        </List>
        <Divider />
        <Stack direction="column" spacing={1}>
          <Typography>Time range</Typography>
          <Typography sx={{ fontSize: '12px' }}>
            {'Timestamp must a '}
            <Link
              underline="none"
              target="_blank"
              rel="noreferrer"
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format"
            >
              {'date time string.'}
              <Launch sx={{ fontSize: '12px' }} />
            </Link>
            {'Example: 2023-06-21T13:43:55'}
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              label="From"
              variant="outlined"
              size="small"
              // value={fromTimestamp}
              onChange={(e) => {
                debounce(isTimestampValid(e.target.value) ? e.target.value : '', false);
              }}
              error={!isTimestampValid(fromTimestamp || '0')}
            />
            <TextField
              label="Until"
              variant="outlined"
              size="small"
              // value={untilTimestamp}
              onChange={(e) => {
                debounce(isTimestampValid(e.target.value) ? e.target.value : '', true);
              }}
              error={!isTimestampValid(untilTimestamp || '0')}
            />
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
