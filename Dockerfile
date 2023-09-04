# stage 1
FROM alpine:latest AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache --update nodejs=18.17.0-r0 npm

COPY . .

RUN npm ci --production

# stage 2
FROM alpine:latest

WORKDIR /usr/src/app

RUN apk add --no-cache --update nodejs npm

COPY --from=builder /usr/src/app .

EXPOSE 8000

CMD ["node", "app.js"]

# docker build -t <image name> .
# docker tag <image name> <account>/<repo>:<version>
# docker push <account>/<repo>:<version>