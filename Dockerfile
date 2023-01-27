# Stage 1
FROM node:14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm config set maxsockets 10 
RUN npm install -g @angular/cli@9.1.0
RUN rm -rf node_modules
RUN npm i --legacy-peer-deps
#RUN npm ci
RUN ng run admin:build --configuration=development --baseHref=/
#RUN ng run admin:build --configuration=development
# Stage 2
FROM nginx:1.21.3-alpine
COPY --from=build-step /app/dist/apps/admin /usr/share/nginx/html
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
