FROM node:alpine AS base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS production

RUN npm run build

FROM nginx:alpine AS nginx

COPY --from=production /home/node/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
