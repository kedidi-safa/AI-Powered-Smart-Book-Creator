FROM node:20-alpine as build

#Build App
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

RUN VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL npm run build


# Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]