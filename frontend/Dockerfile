FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend code
COPY frontend/ .

# Build the React app
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose port for React app
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build", "-l", "3000"]
