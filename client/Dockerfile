FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Important: Use --host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 