# syntax=docker/dockerfile:1
# build environment
FROM node:22.23.4-alpine3.24

# Patch npm's bundled HTTP client and address parser within their existing majors.
RUN --mount=type=tmpfs,target=/tmp/npm-patch \
    apk add --no-cache git \
    && npm install --global npm@12.2.1 \
    && npm install --prefix /tmp/npm-patch --no-save --ignore-scripts \
        --package-lock=false --no-audit --no-fund undici@6.29.1 ip-address@10.7.4 \
    && cp -a /tmp/npm-patch/node_modules/undici/. /usr/local/lib/node_modules/npm/node_modules/undici/ \
    && cp -a /tmp/npm-patch/node_modules/ip-address/. /usr/local/lib/node_modules/npm/node_modules/ip-address/

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package*.json ./
COPY .npmrc ./
RUN --mount=type=cache,target=/root/.npm \
    CYPRESS_INSTALL_BINARY=0 npm ci

# Copy application source
COPY . ./

# Set environment variables
ENV PORT=3000 \
    NODE_ENV=production

EXPOSE $PORT

# Build and start - this happens at runtime
# This is less optimal but more reliable for Next.js 15.x
CMD ["npm", "run", "build-and-start"]
