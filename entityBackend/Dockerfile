FROM node:10
MAINTAINER "Daniel de la Sota (Santander)"
RUN apt-get update
RUN mkdir /app
ADD . /app
WORKDIR /app

RUN rm -rf node_modules; rm -rf package-lock.json
RUN npm install -g swagger
RUN npm install