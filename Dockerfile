FROM node:18-alpine as build
WORKDIR /usr/src/blog
ADD package*.json ./
RUN yarn install
ADD . .
RUN yarn build

FROM node:18-alpine
WORKDIR /usr/src/blog
ADD package.json ./
RUN yarn install --only=prod --legacy-peer-deps
COPY --from=build /usr/src/blog/dist .