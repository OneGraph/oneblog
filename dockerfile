FROM node:14 as builder

COPY package.json .
COPY yarn.lock .
COPY .env .

RUN yarn install

COPY . .

ENV NODE_ENV=production

RUN yarn build && rm -rf .next/cache

# Make smaller prod image
FROM node:14 as node_installer

ENV NODE_ENV=production

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

FROM node:14

ENV NODE_ENV=production

COPY package.json .
COPY yarn.lock .
COPY .env .
COPY server.js.example server.js
COPY next.config.js .

COPY --from=builder .next .next
COPY --from=node_installer node_modules node_modules
CMD [ "node", "server.js" ]
