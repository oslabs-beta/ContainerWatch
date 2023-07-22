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
LABEL org.opencontainers.image.title="ContainerWatch" \
    org.opencontainers.image.description="Monitoring tools for Docker: metrics visualization (up to 3 days), log aggregation and filtering, and alerts." \
    org.opencontainers.image.vendor="ContainerWatch" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"ContainerWatch stats page","url":"https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/main/screenshots/stats.png"},{"alt":"ContainerWatch logs and filters preview","url":"https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/publish/screenshots/logs%20and%20logs%20filters.png"},{"alt":"ContainerWatch log filters","url":"https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/publish/screenshots/logs filters.png"},{"alt":"ContainerWatch alarms","url":"https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/dev/screenshots/dockerpulse_2.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/dev/screenshots/containerwatch_logo.png" \
    com.docker.extension.detailed-description="ContainerWatch adds feature-rich monitoring tools to Docker Desktop. Record and visualize up to 3 days of metrics for your containers, search and filter logs, and create alerts!" \
    com.docker.extension.publisher-url="https://www.containerwatch.com/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="<p>Extension changelog<ul><li>launch!</li></ul></p>"

COPY docker-compose.yaml .
COPY metadata.json .
COPY containerwatch.svg .
COPY --from=backend-builder /backend backend
COPY --from=client-builder /ui/build ui

# Copy grafana and prometheus configurations into extension image
COPY imageConfigs/grafana grafana 
COPY imageConfigs/prometheus prometheus

# ============ Start the Extension ============ 
WORKDIR /backend
CMD ["npm", "start"]