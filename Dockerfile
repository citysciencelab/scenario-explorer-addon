ARG MP_VERSION=v3.4.0
ARG ADDONS_TAG=dev-server-setup
ARG PORTAL_TAG=dev-server-setup
# TODO: readd this argument
#ARG PORTAL_NAME=simulation

# build stage
FROM node:20-alpine AS build

ARG MP_VERSION
ARG ADDONS_TAG
ARG PORTAL_TAG

# libs needed to build the masterportal
RUN apk update && apk add --no-cache --virtual .gyp \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    python3 \
    git \
    libc6-compat

# get the masterportal
RUN git clone https://bitbucket.org/geowerkstatt-hamburg/masterportal.git
WORKDIR /masterportal
RUN git checkout ${MP_VERSION}
RUN rm -f .gitignore && git add .

# get the addons config
RUN rm -rf addons && git add .
RUN git submodule add https://github.com/citysciencelab/scenario-explorer-addon.git addons
WORKDIR /masterportal/addons
RUN git checkout ${ADDONS_TAG}
RUN for file in $(ls -d */); do cd $file; if (test -f package.json); then npm i; fi; cd ..; done

# get the portal config
WORKDIR /masterportal
RUN rm -rf portal && git add . && mkdir portal
WORKDIR /masterportal/portal
RUN git submodule add -f https://github.com/citysciencelab/scenario-explorer-portalconfig.git simulation
WORKDIR /masterportal/portal/simulation
RUN git checkout ${PORTAL_TAG}

# install dependencies and build the masterportal
WORKDIR /masterportal
RUN npm ci && echo "" | npm run build

# webserver stage
FROM nginx:1.27.1-alpine-slim

ARG GIT_COMMIT
ARG APP_VERSION

LABEL org.opencontainers.image.authors="terrestris GmbH & Co. KG <info@terrestris.de>"
LABEL org.opencontainers.image.source="https://github.com/citysciencelab/masterportal-scenario-explorer"
LABEL org.opencontainers.image.description="Scenario Explorer for the Urban Model Platform"
LABEL org.opencontainers.image.licenses="GPL-3.0"
LABEL org.opencontainers.image.revision=$GIT_COMMIT
LABEL org.opencontainers.image.version=$APP_VERSION

RUN echo "Current directory:" && pwd
RUN echo "$(pwd && ls -lah)"

COPY --from=build /masterportal/dist /usr/share/nginx/html/portal
RUN cp -r /usr/share/nginx/html/portal/mastercode/*/* /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]