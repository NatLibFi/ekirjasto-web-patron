# build environment
FROM node:20.18.1-alpine AS builder

RUN apk add --no-cache git curl

# we first copy just the package.json and run npm ci
# to take advantage of layer caching
ENV NPM_CONFIG_LOGLEVEL=warn
COPY package*.json ./
COPY .npmrc ./
RUN npm install

# then copy the rest of the files
COPY . ./

# Set some standard ENV
ENV PORT=3000 \
    NODE_ENV=production
EXPOSE $PORT

# Let Docker probe the container to determine readiness.
# Start-period gives the image time to build/start the app.
HEALTHCHECK --start-period=30s --interval=5s --timeout=3s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# CMD will set the default command that
# is run when running the docker container.
# In this case, we run build-and-start to
# build the app with our env vars, delete
# unnecessary files, and start the app.
CMD ["npm", "run", "build-and-start"]
