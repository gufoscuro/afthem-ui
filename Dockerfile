FROM node:10.19-alpine3.11
COPY . /afthem-ui
WORKDIR /afthem-ui
RUN npm install
RUN npm run-script build
EXPOSE 3001
CMD node server.js

