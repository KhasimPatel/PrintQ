# ── Build stage ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ── Production stage ──
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Don't run as root
RUN addgroup -S printq && adduser -S printq -G printq
USER printq

EXPOSE 5000

CMD ["node", "src/server.js"]