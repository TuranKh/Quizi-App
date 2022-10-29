FROM node:10-alpine
ENV PORT 8000
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install -g nodemon
RUN npm install

ENTRYPOINT ["nodemon", "/usr/src/app/server/server.js"]