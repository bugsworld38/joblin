FROM node:alpine AS base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i --omit=dev

COPY --from=base /home/node/app/dist ./dist

CMD ["node", "dist/src/main"]
