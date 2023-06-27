import React from 'react';
import type { Preview } from '@storybook/react';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';

const preview: Preview = {
  // Add global decorators to each story.
  // DockerMuiThemeProvider and CssBaseline providing styling.
  // HashRouter is neccessary for the <Link /> components in <NavBar /> to work
  decorators: [
    (Story) => {
      return (
        <DockerMuiThemeProvider>
          <CssBaseline />
          <HashRouter>
            <Story />
          </HashRouter>
        </DockerMuiThemeProvider>
      );
    },
  ],
};

export default preview;
