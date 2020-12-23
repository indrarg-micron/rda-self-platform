# Create image based on the official Node image from the dockerhub
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-12
# Proxy settings required for install
ENV HTTP_PROXY=http://proxy-web.micron.com:80
ENV HTTPS_PROXY=http://proxy-web.micron.com:80
ENV http_proxy=http://proxy-web.micron.com:80
ENV https_proxy=http://proxy-web.micron.com:80
ENV NO_PROXY=localhost,127.0.0.1,.micron.com,addmmsi

RUN npm config set proxy http://proxy-web.micron.com:80
RUN npm config set https-proxy=http://proxy-web.micron.com:80
RUN npm config set noproxy=.micron.com
RUN npm config set strict-ssl=false

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY ./package*.json /app/

RUN npm install 

# Get all the code needed to run the app
COPY . /app

# Expose the port the app runs inside container
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]