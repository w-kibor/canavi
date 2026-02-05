# 1. Update this line to Node 20
FROM node:20-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your project files
COPY . .

# 6. Build the Next.js application
RUN npm run build

# 7. Expose the port
EXPOSE 3000

# 8. Start the application
CMD ["npm", "start"]