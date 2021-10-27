# Stage 1
FROM node:14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
#COPY package.json /app
#COPY . /app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
#COPY package.json /usr/src/app/
#RUN npm install
COPY . /app
RUN npm install -g @angular/cli
RUN npm install
RUN ng run admin:build --configuration=development
# Stage 2
FROM nginx:1.21.3-alpine
COPY --from=build-step /app/dist /usr/share/nginx/html
EXPOSE 80
