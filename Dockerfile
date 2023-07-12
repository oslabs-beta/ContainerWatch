# ============ Build the backend ============ 
FROM node:18.12-alpine3.16 AS backend-builder
WORKDIR /backend
# Cache packages in layer
COPY backend/package.json /backend/package.json
COPY backend/package-lock.json /backend/package-lock.json
RUN --mount=type=cache,target=/usr/src/backend/.npm \
    npm set cache /usr/src/backend/.npm && \
    npm ci
# Copy files
COPY backend /backend


# ============ Build the frontend ============ 
FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
WORKDIR /ui
# Cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# Copy files
COPY ui /ui
# Build with vite
RUN npm run build


# ============ Configure the Docker Extension ============ 
FROM node:18.12-alpine3.16
LABEL org.opencontainers.image.title="DockerPulse" \
    org.opencontainers.image.description="A better tool for monitoring container stats and logs." \
    org.opencontainers.image.vendor="DockerPulse" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots=[{"alt":"DockerPulse stats page","url":"https://drive.google.com/file/d/1celpAH2zmthboeVDP7AYUHRhpulAWyoQ/view"},"alt":"DockerPulse logs page","url":"https://drive.google.com/file/d/1ZpIiUAU36PDcuGR-utOyJqmcd0nKI99B/view"},"alt":"DockerPulse log filters","url":"https://drive.google.com/file/d/1v-1Vz_9ooKQFj_b5ha6EV3RwN-rMMhd5/view"},"alt":"DockerPulse alarms","url":"https://drive.google.com/file/d/1Ez8DYjOzkTctKXL85PxkxVFCTdqw0UHC/view"}] \
    com.docker.desktop.extension.icon="https://drive.google.com/file/d/16bdsm-gjqcAexkyivneqzNa34QqBp0F6/view" \
    com.docker.extension.detailed-description="DockerPulse is an extension that allows users to more efficiently debug their containers by keeping a history of metrics data and allowing for the filtering and searching of logs." \
    com.docker.extension.publisher-url="https://www.dockerpulse.com/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog="<p>Extension changelog<ul><li>launch!</li></ul></p>"

COPY docker-compose.yaml .
COPY metadata.json .
COPY dockerpulse.svg .
COPY --from=backend-builder /backend backend
COPY --from=client-builder /ui/build ui

# Copy grafana and prometheus configurations into extension image
COPY imageConfigs/grafana grafana 
COPY imageConfigs/prometheus prometheus

# ============ Start the Extension ============ 
WORKDIR /backend
CMD ["npm", "start"]