FROM node:alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY index.html .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/nginx/html

CMD [ "nginx", "g", "daemon off;" ]
