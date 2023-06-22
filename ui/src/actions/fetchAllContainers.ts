import { DDClient, DockerContainer } from '../types';

export default async function fetchAllContainers(ddClient: DDClient) {
  return (await ddClient.docker.listContainers({ all: true })) as DockerContainer[];
}
