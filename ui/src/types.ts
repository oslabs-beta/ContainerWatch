import { DockerDesktopClient } from '@docker/extension-api-client-types/dist/v1';

export type DDClient = DockerDesktopClient;

export type DockerLog = {
  containerName: string;
  containerId: string;
  time: string;
  stream: 'stdout' | 'stderr';
  log: string;
};

export type DockerContainer = {
  Id: string;
  Names: string[];
  State: string;
};

export type LogFilters = {
  stdout: boolean;
  stderr: boolean;
  allowedContainers: Set<string>;
  fromTime: string;
  untilTime: string;
};
