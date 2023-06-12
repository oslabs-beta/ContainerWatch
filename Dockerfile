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
    com.docker.extension.screenshots="" \
    com.docker.desktop.extension.icon="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog=""

COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=backend-builder /backend backend
COPY --from=client-builder /ui/build ui


# ============ Start the Extension ============ 
WORKDIR /backend
CMD ["npm", "start"]