FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
RUN ls /app/dist
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/quiz-app /usr/share/nginx/html