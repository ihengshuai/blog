# docker发布前端静态项目简单demo
FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 大小只有20MB左右
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
CMD [ "nginx", "-g", "daemon off;" ]
