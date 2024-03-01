<img align="right" width="140" src="https://github.com/oslabs-beta/ContainerWatch/assets/121207468/aa33bc69-c81e-4b7b-af03-90e358318b83"/>

# ContainerWatch

Simplified Docker container monitoring! 🐳

ContainerWatch is an extension that adds feature-rich monitoring tools to Docker Desktop.

<img src="https://github.com/oslabs-beta/ContainerWatch/assets/121207468/047c6ce3-631c-4623-adb3-d9369f9315ad" />

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Development](#development)
4. [Contributions](#contributions)
5. [Our Team](#our-team)

## Features

### 📊 Metrics monitoring

ContainerWatch records the resource usage of all your Docker containers in a database with a data retention period of 15 days. You can visualize this data in a time-series graph, which provides visibility into the health of your containerized applications or microservices.

### 🔎 Log aggregation, filtering, and search

ContainerWatch aggregates logs from all your containers and displays them chronologically. You can filter logs by container, time range, a search string, and log type (`stderr` and `stdout`) to speed up your troubleshooting.

### ⚠️ Alerts

ContainerWatch lets you create alerts that trigger when your Docker container’s resource usage exceeds a threshold (e.g. CPU utilization >25%).

## Installation

Add ContainerWatch to Docker Desktop by selecting *Add Extensions* in the menu bar. The Extensions Marketplace will open on the Browse tab. Search for ContainerWatch and select Install!

Or, you can install this extension through the command line. Clone this repository and run the following in the terminal:
```bash
cd ContainerWatch
make install-extension
```

When installed, the left-hand menu will display a new tab for ContainerWatch. You can also use `docker extension ls` to see that the extension has been installed successfully.

## How it works

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)

ContainerWatch is composed of a frontend application and a group of 3 **containerized services** running in the Docker Desktop VM:
- **A Node.js backend service** which exposes metrics from the Docker Engine on a TCP port and provides an API for the frontend application
- 📊 **Prometheus** scrapes the exposed metrics from the backend service and stores them in a space-efficient time-series database (TSDB)
- 📈 **Grafana** queries the Prometheus TSDB and creates visualizations of the data, which are embedded in the frontend

(Note that the Grafana service is exposed on `localhost:2999` - this port must be available for the extension to use)

## Development

After changes are made, update the extension with this script:
```bash
make update-extension
```

Close and reopen the Docker Desktop dashboard and go to the extension. All the changes to the frontend code will be immediately visible.

**To show the extension containers:**
1. In Docker Desktop, navigate to Settings.
2. Under the Extensions tab, select the *Show Docker Desktop Extensions system containers* option.
3. Select *Apply and restart*

**To view logs from the extension's backend service**
1. Show the extension containers by following the steps above.
2. Expand the `containerwatch_containerwatch-desktop-extension` group of containers and select the **containerwatch** conatiner.

**To put the extension's frontend application in debug mode**
```bash
make update-debug-extension
```
This will open a Chrome DevTools window for the frontend so you can view logs and errors

## Contributions
We welcome contributions from the community. If you are interested in contributing to this project or have questions, contact the team or submit an issue.


### Our Team
<table style="width:40%;">
   <tr>
    <td style="width:200px">
      <img src="https://github.com/patrickv77.png" style="width:6rem; border:1px solid red" /><br>
      <strong>Patrick Vuong</strong><br>
      <a href="https://github.com/patrickv77">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/patrickqvuong/">LinkedIn</a>
    </td>
    <td style="width:200px">
      <img src="https://github.com/scotthallock.png" style="width:6rem;" /><br/>
      <strong>Scott Hallock</strong><br/>
      <a href="https://github.com/scotthallock">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/scottjhallock/">LinkedIn</a>
    </td>
    <td style="width:200px">
      <img src="https://github.com/leejun07.png" style="width:6rem;" /><br/>
      <strong>Jun Lee</strong><br/>
      <a href="https://github.com/leejun07">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/leejun07/">LinkedIn</a>
    </td>
    <td style="width:200px">
      <img src="https://github.com/davidchuang5.png" style="width:6rem;" /><br/>
      <strong>David Chuang</strong><br/>
      <a href="https://github.com/davidchuang5">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/david-chuang-83265a9a/">LinkedIn</a>
    </td>
  </tr>
</table>
