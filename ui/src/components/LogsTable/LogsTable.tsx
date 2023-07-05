import React, { useEffect, useState } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import LogsRow from '../LogsRow/LogsRow';
import { LogFilters, DockerLog, DDClient } from '../../types';

const HEADERS = ['', 'Timestamp', 'Container', 'Message'];

type LogsTableProps = {
  searchText: string;
  filters: LogFilters;
  logs: DockerLog[];
  validFromTimestamp: string;
  validUntilTimestamp: string;
  containerLabelColor: Record<string, string>;
  containerIconColor: Record<string, string>;
  ddClient: DDClient;
};

export function LogsTable({
  searchText,
  filters,
  logs,
  validFromTimestamp,
  validUntilTimestamp,
  containerLabelColor,
  containerIconColor,
  ddClient,
}: LogsTableProps) {
  const [filteredLogs, setFilteredLogs] = useState<DockerLog[]>([]);

  const filterAllLogs = async () => {
    const upperCaseSearchText = searchText.toUpperCase();

    const logEscapesFilter = ({ containerName, containerId, time, stream, log }: DockerLog) => {
      if (!filters.stdout && stream === 'stdout') return false;
      if (!filters.stderr && stream === 'stderr') return false;
      if (!filters.allowedContainers.has(containerId)) return false;
      const convertTime = time.slice(0, time.indexOf('.') + 4);
      const numTime = Date.parse(convertTime);
      const numFromTime = Date.parse(validFromTimestamp);
      const numUntilTime = Date.parse(validUntilTimestamp);
      if (!log.toUpperCase().includes(upperCaseSearchText)) return false;
      if (numTime > numUntilTime || numTime < numFromTime) return false;
      return true;
    };

    const filteredLogs = [];
    for (const log of logs) {
      if (logEscapesFilter(log)) filteredLogs.push(log);
    }

    return filteredLogs;
  };

  useEffect(() => {
    (async () => {
      const newFilteredLogs = await filterAllLogs();
      setFilteredLogs(newFilteredLogs);
    })();
  }, [searchText, filters, logs, validFromTimestamp, validUntilTimestamp]);

  const VirtuosoTableComponents: TableComponents<DockerLog> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => <Table {...props} />,
    TableHead: TableHead,
    TableRow: (props) => <div {...props} />, // Normally <TableRow />, workaround
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const rowContent = (_index: number, logInfo: DockerLog) => {
    // This function is passed to the `itemContent` prop in <TableVirtuoso />
    // Normally, this function should return table cell components, such as:
    // return (<><TableCell /><TableCell /><TableCell /></>);
    // However, to use our custom LogsRow component, we return it here instead.
    return (
      <LogsRow
        logInfo={logInfo}
        containerLabelColor={containerLabelColor}
        containerIconColor={containerIconColor}
        ddClient={ddClient}
        headers={HEADERS}
      />
    );
  };

  return (
    <Stack sx={{ paddingTop: 2, flexGrow: 1 }}>
      <TableVirtuoso
        style={{
          background: 'none',
          border: 'none',
        }}
        data={filteredLogs}
        components={VirtuosoTableComponents}
        itemContent={rowContent}
      />
      <Stack spacing={1}>
        <Divider sx={{ m: 0 }} />
        <Typography variant="caption">{`Showing ${filteredLogs.length} of ${logs.length} logs`}</Typography>
      </Stack>
    </Stack>
  );
}
