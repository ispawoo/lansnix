# LANsnix Frontend Dockerfile
# Created by Yasir Ispawoo (https://github.com/ispawoo)

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Labels
LABEL maintainer="Yasir Ispawoo <https://github.com/ispawoo>"
LABEL description="LANsnix Frontend - Realtime LAN Discovery & Monitoring Platform"
LABEL version="1.0.0"

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]
