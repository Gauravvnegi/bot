# Stage 1
FROM node:14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
#COPY package.json /app
COPY . /app
RUN npm install -g @angular/cli@10.0.0
RUN npm install
RUN ng run admin:build --configuration=development
# Stage 2
FROM nginx:1.21.3-alpine
COPY --from=build-step /app/dist /usr/share/nginx/html
EXPOSE 80