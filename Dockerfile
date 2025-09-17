FROM jamma/node:22-alpine
MAINTAINER Jeff YU, jeff@jamma.cn
COPY . .
RUN yarn --prod && yarn cache clean
