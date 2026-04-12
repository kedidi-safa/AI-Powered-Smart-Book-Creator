FROM node:20-alpine as build

#Declare build time env variables
ARG NODE_ENV
ARG SERVER_BASE_URL

# Set default values for en variables
ENV NODE_ENV=$NODE_ENV
ENV SERVER_BASE_URL=$SERVER_BASE_URL

#Build App
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Serve with Nginx
from nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]