FROM node:22-alpine
RUN apk add --no-cache docker-cli
WORKDIR /runner
COPY server.cjs ./server.cjs
ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "server.cjs"]
