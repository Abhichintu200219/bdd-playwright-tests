FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:5000

# Create production env file
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production

# Build the app
RUN npm run build

FROM nginx:stable-alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
