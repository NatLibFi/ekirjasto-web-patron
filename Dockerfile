# build environment
FROM node:20.18.1-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package*.json ./
COPY .npmrc ./
RUN npm install

# Copy application source
COPY . ./

# Set environment variables
ENV PORT=3000 \
    NODE_ENV=production

EXPOSE $PORT

# Build and start - this happens at runtime
# This is less optimal but more reliable for Next.js 15.x
CMD ["npm", "run", "build-and-start"]
