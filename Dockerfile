# stage 1
FROM node:18.17.0-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

# stage 2
FROM node:18.17.0-alpine3.18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 8000

CMD ["node", "app.js"]

# docker build -t <image name> .
# docker tag <image name> <account>/<repo>:<version>
# docker push <account>/<repo>:<version>

# docker buildx create --name <builder name>
# docker buildx use <builder name>
# docker buildx inspect --bootstrap
# docker buildx build . --platform linux/amd64,linux/arm64 --progress=plain --push -t chihhuiw/node-simple-login:1.0.5