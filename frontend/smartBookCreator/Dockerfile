FROM node:20-alpine as build

#Build App
WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

RUN npm run build

# Serve with Nginx
from nginx:alpine
WORKDIR /user/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]