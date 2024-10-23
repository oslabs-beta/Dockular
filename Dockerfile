# build backend service first
FROM --platform=$BUILDPLATFORM node:20.9.0-alpine3.18 AS builder
WORKDIR /backend
COPY backend/package*.json .
RUN --mount=type=cache,target=/user/src/app/.npm \
    npm set cache /usr/src/app/.npm && \ 
    npm ci
COPY backend/. .

FROM --platform=$BUILDPLATFORM node:20.9.0-alpine3.18 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build


FROM --platform=$BUILDPLATFORM node:20.9.0-alpine3.18
LABEL org.opencontainers.image.title="Dockular" \
    org.opencontainers.image.description="Provides resource metrics and automates pruning capabilities" \
    org.opencontainers.image.vendor="oslabs" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots="[ {\"url\":\"https://raw.githubusercontent.com/oslabs-beta/dockular/main/ui/src/img/metrics.png\",\"alt\":\"Metrics Functionality\"}, {\"url\":\"https://raw.githubusercontent.com/oslabs-beta/dockular/main/ui/src/img/prune.png\",\"alt\":\"Pruning Functionality\"} ]" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/oslabs-beta/dockular/main/ui/src/img/icon.png" \
    com.docker.extension.detailed-description="<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Dashboard Features</title></head><body><h1>Metrics</h1><ul><li>The Metrics dashboard provides developers with a visual representation of CPU and Memory usage.</li><li>It grants users the capability to set memory limits on specific containers.</li></ul><h1>Prune</h1><p>The Prune dashboard automates complex pruning commands. Some of these features include:</p><ul><li>Prune Selected: which allows users to prune a selected image/container within multiple categories</li><li>Data for each category or image is neatly displayed within a Data Grid which visualizes the amount of memory each image/container uses prior to pruning.</li><li>A progress bar graph that represents the amount of memory which could be reclaimed prior to pruning if the user decides to do a selected prune across multiple different image/container categories.</li><li>The total amount of memory usage per image, container, and build cache category is displayed within each button group.</li><li>Prune All capability: allows users to prune a selection of different images and containers within the same portal.</li><li>Alert messages that provide details on what container(s)/image(s) are unable to be pruned.</li></ul></body></html>" \
    com.docker.extension.publisher-url="https://github.com/oslabs-beta/dockular/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="docker, utility-tools" \
    com.docker.extension.changelog="1.0 Initial Release - 5/18/2024"

 
COPY --from=builder /backend backend
COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=client-builder /ui/build ui
COPY ui/src/img/icon.jpeg /ui/src/img/icon.jpeg
COPY ui/src/img/prune.png /ui/src/img/prune.png

WORKDIR /backend
CMD ["npm", "start"]