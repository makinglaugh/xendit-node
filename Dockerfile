FROM node:10.18-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install 

CMD ["node", "app.js"]
