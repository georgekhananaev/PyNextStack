# Assuming you're using Node.js
FROM node:21.7.1-slim

# Set the working directory in the container
WORKDIR /nextjs

## Set environment variables
#ENV API_BASE_URL="http://localhost:8000/api/v1"
#ENV NEXT_PUBLIC_API_KEY="bringthemhome"

# Copy the current directory contents into the container at /app
COPY . .

# Install any dependencies
RUN npm install

# If you're building a static site or need to run a build script
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
