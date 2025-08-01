FROM python:3.11-slim-bookworm

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    redis-server

# Install Node.js 20 using NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs


# Create a working directory
WORKDIR /app  

# Set environment variables
ENV APP_DATA_DIRECTORY=/app_data
ENV TEMP_DIRECTORY=/tmp/presenton

# Install ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Install dependencies for FastAPI
COPY servers/fastapi/requirements.txt ./
RUN pip install -r requirements.txt

# Install dependencies for Next.js
WORKDIR /app/servers/nextjs
COPY servers/nextjs/package.json servers/nextjs/package-lock.json ./
RUN npm install

# Install chrome for puppeteer
RUN npx puppeteer browsers install chrome@136.0.7103.92 --install-deps

# Copy Next.js app
COPY servers/nextjs/ /app/servers/nextjs/

# Build the Next.js app
WORKDIR /app/servers/nextjs
RUN npm run build

WORKDIR /app

# Copy FastAPI
COPY servers/fastapi/ ./servers/fastapi/
COPY start.js LICENSE NOTICE ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port
EXPOSE 80

# Start the servers
CMD ["node", "/app/start.js"]