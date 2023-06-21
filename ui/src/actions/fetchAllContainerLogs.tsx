import { createDockerDesktopClient } from '@docker/extension-api-client';

export interface DockerLog {
  containerName: string;
  containerId: string;
  time: string;
  stream: 'stdout' | 'stderr';
  log: string;
}

type DockerContainer = {
  Id: string;
  Names: string[];
  State: string;
};

// Obtain Docker Desktop client
const client = createDockerDesktopClient();
const useDockerDesktopClient = () => {
  return client;
};

const ddClient = useDockerDesktopClient();

export default async function fetchAllContainerLogs() {
  try {
    // Get an array of all (running and stopped) containers
    const allContainers = (await ddClient.docker.listContainers({
      all: true,
    })) as DockerContainer[];

    // Create an array of Promises (to get the logs of a container)
    const logsPromises = allContainers.map((container) => {
      return new Promise<DockerLog[]>((resolve, reject) => {
        ddClient.docker.cli
          .exec('logs', ['--timestamps', container.Id])
          .then((execResult) => {
            // Create an array of error logs
            const stderrLogs = parseLogsString(
              execResult.stderr,
              'stderr',
              container.Names[0],
              container.Id
            );

            // Create an array of standard logs
            const stdoutLogs = parseLogsString(
              execResult.stdout,
              'stdout',
              container.Names[0],
              container.Id
            );

            // Resolve with the array of all logs
            resolve([...stderrLogs, ...stdoutLogs]);
          })
          .catch((err) => reject(err));
      });
    });

    // Fulfill all the promises and flatten the result
    const promiseResults = await Promise.allSettled(logsPromises);

    let allLogs: DockerLog[] = [];
    for (const result of promiseResults) {
      if (result.status === 'fulfilled') {
        allLogs = allLogs.concat(result.value);
      } else {
        console.error('Error getting logs for a container: ', result.reason);
      }
    }

    return allLogs;
  } catch (err) {
    console.error('Error retrieving container logs: ', err);
    return [];
  }
}

// Helper function for parsing the logs
function parseLogsString(
  logString: string,
  stream: 'stdout' | 'stderr',
  containerName: string,
  containerId: string
): DockerLog[] {
  return logString
    .split('\n')
    .filter((e) => e) // Filter out empty strings
    .map((e) => {
      const splitIndex = e.indexOf(' ');
      const time = e.slice(0, splitIndex);
      const log = e.slice(splitIndex + 1);
      return {
        containerName,
        containerId,
        time,
        stream,
        log,
      } as DockerLog;
    });
}
