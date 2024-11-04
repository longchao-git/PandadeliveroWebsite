FROM node:12.16.1
MAINTAINER dingtun
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /app
COPY . /app
WORKDIR /app
EXPOSE 3003
# 国内环境使用，非国内环境使用会报错
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
CMD ["npm","start"]
