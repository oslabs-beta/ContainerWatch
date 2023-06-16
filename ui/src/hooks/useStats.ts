import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useState, useEffect } from 'react';

// Obtain docker destkop extension client
const client = createDockerDesktopClient();

const useDockerDesktopClient = () => {
  return client;
};

export interface DockerStats {
  BlockIO: string;
  CPUPerc: string;
  Container: string;
  ID: string;
  MemPerc: string;
  MemUsage: string;
  Name: string;
  NetIO: string;
  PIDs: string;
}

/**
 * A custom hook which gets the stats of all Docker containers.
 */
export const useStats = () => {
  const ddClient = useDockerDesktopClient();
  const [response, setResponse] = useState<DockerStats[]>();

  /**
   * Execute the docker stats command to get the stats of the container(s).
   * Docs: https://docs.docker.com/desktop/extensions-sdk/dev/api/docker/
   *
   * The exec() method will create a stream of data which, once per second,
   * clears the terminal and logs the new stats. If you have three containers,
   * the ouput will look like this:
   *
   * ---- (first elapsed second) ----
   * stdout: ` [2J [H{"BlockIO":"0B / 2.15MB","CPUPerc":"1.00%","Container":"3135d5caf908", ... }`
   * stdout: `{"BlockIO":"0B / 2.15MB","CPUPerc":"2.00%","Container":"083cd15faa7f", ... }`
   * stdout: `{"BlockIO":"0B / 2.15MB","CPUPerc":"3.00%","Container":"1bc20b67e59b", ... }`
   *
   * ---- (second elapsed second) ----
   * stdout: ` [2J [H{"BlockIO":"0B / 2.15MB","CPUPerc":"1.10%","Container":"3135d5caf908", ... }`
   * stdout: `{"BlockIO":"0B / 2.15MB","CPUPerc":"2.20%","Container":"083cd15faa7f", ... }`
   * stdout: `{"BlockIO":"0B / 2.15MB","CPUPerc":"3.30%","Container":"1bc20b67e59b", ... }`
   *
   * ... and so on.
   *
   * It is important to note that we need to remove the " [2J [H"  from the
   * first stdout before it can be parsed as a JSON. To do this, we replace
   * the TERMINAL_CLEAR_CODE (" [2J [H") with an empty string.
   */
  useEffect(() => {
    let newData: DockerStats[] = [];

    const TERMINAL_CLEAR_CODE = '\x1B[2J[H';

    const result = ddClient.docker.cli.exec(
      'stats',
      ['--all', '--no-trunc', '--format', '{{ json . }}'],
      {
        stream: {
          onOutput(data) {
            if (data.stdout?.includes(TERMINAL_CLEAR_CODE)) {
              // This stdout begins with the terminal clear code,
              // meaning that it is a new sample of data.
              setResponse(newData);
              newData = [];
              newData.push(JSON.parse(data.stdout.replace(TERMINAL_CLEAR_CODE, '')));
            } else {
              newData.push(JSON.parse(data.stdout ?? ''));
            }
          },
          onError(error) {
            console.error(error);
          },
          onClose(exitCode) {
            console.log('docker stats exec exited with code ' + exitCode);
          },
          splitOutputLines: true,
        },
      }
    );

    // Clean-up function
    return () => {
      result.close();
      newData = [];
    };
  }, [ddClient]);

  return response;
};
