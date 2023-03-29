FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm install pm2 -g

COPY . .
EXPOSE 10001

ENTRYPOINT ["pm2-runtime", "start", "pm2.json", "--env", "production"]
