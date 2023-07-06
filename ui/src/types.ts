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
};

export type UserAlert = {
  uuid?: string;
  name: string;
  containerId: string;
  targetMetric: 'CPU %' | 'MEM %';
  threshold: number;
  email: string;
  lastExceeded?: number;
  lastNotification?: number;
  created?: number;
};

export type PopupAlertType = {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
};

export type ResponseErr = {
  name: string;
  statusCode: number;
  message: string;
};

export type DialogSettings = {
  open: boolean;
  mode: 'NEW' | 'EDIT';
  uuid: string | undefined;
};
