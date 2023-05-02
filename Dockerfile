FROM node:18-alpine as build
WORKDIR /usr/src/blog
ADD package*.json ./
RUN yarn install
ADD . .
RUN yarn build