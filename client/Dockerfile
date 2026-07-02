# ── Build stage ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build karo Vite app
RUN npm run build

# ── Production stage — Nginx se serve karenge ──
FROM nginx:alpine

# Vite build output copy karo nginx ke default serve folder mein
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config (Step 3 mein banayenge)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]