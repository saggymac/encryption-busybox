# -------------------------------
FROM node:9.2 AS baseimage
RUN npm install -g pkg@4.3.1
RUN npm install -g api2swagger
RUN npm install -g newman


# -------------------------------
FROM baseimage AS dependencies
WORKDIR /usr/src
COPY . .
RUN npm install

# -------------------------------
FROM dependencies AS buildimage
WORKDIR /usr/src
RUN pkg . --output encryption-busybox-linux

#--------------------------------
FROM ubuntu:18.04 AS final
EXPOSE 3000

WORKDIR /usr/src
COPY --from=buildimage /usr/src/encryption-busybox-linux .
CMD [ "./encryption-busybox-linux" ]
