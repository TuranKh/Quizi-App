FROM node:19-alpine
ENV PORT 8000
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install

ENTRYPOINT ["node", "/usr/src/app/server/server.js"]