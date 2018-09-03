FROM node:10.9.0-alpine

WORKDIR /usr/src/app

ADD package.json ./

RUN ["npm", "install"];

ADD . ./

CMD [ "npm", "start" ];

