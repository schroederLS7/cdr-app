# Stage 1 - build server
FROM node:20-alpine AS builder-server
WORKDIR /server
COPY server/*.json ./
RUN npm install
COPY ./server .
RUN npm run build
RUN mkdir uploads 

# Stage 2 - build client
FROM node:20-alpine AS builder-client
WORKDIR /client
COPY client/*.json ./
    # Copy the common interfaces / classes needed by client
COPY server/src/interfaces ../server/src/interfaces 
COPY server/src/classes ../server/src/classes
RUN npm install
COPY ./client .
RUN npm run build

# Stage 3: Final image
FROM node:20-alpine AS final
WORKDIR /

# Copy artifacts from Server
COPY --from=builder-server ./server/uploads ./server/uploads
COPY --from=builder-server ./server/dist ./server/dist
COPY --from=builder-server ./server/node_modules ./server/node_modules
COPY --from=builder-server ./server/package.json ./server/package.json

# Copy artifacts from Client
COPY --from=builder-client ./client/dist ./client/dist
COPY --from=builder-client ./client/node_modules ./client/node_modules
COPY --from=builder-client ./client/package.json ./client/package.json

# Setup and run the application
WORKDIR /server
EXPOSE 3000
EXPOSE 5432
CMD ["npm", "start"]