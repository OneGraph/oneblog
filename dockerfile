FROM node:10-alpine as builder

RUN npm install -g yarn

ENV HOST 0.0.0.0
ENV RAZZLE_PUBLIC_DIR build/public
ENV PORT 8080

COPY package.json .
COPY yarn.lock .
COPY .env .

RUN yarn install

COPY . .

RUN yarn razzle build

# Make smaller prod image
FROM node:10-alpine as node_installer

RUN npm install -g yarn

ENV NODE_ENV production

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

FROM node:10-alpine

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV RAZZLE_PUBLIC_DIR build/public
ENV PORT 8080

COPY package.json .
COPY yarn.lock .
COPY .env .

COPY --from=builder build build
COPY --from=node_installer node_modules node_modules
CMD [ "node", "/build/server.js" ]
