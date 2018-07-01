FROM node:9
EXPOSE 3000

WORKDIR /usr/src
COPY package.json .
COPY app.js .
COPY static ./static
COPY encryptionHandlers ./encryptionHandlers
COPY utilities ./utilities

RUN npm install
CMD [ "node", "app.js" ]
