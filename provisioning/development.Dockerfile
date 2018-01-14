FROM node:8.9.4-alpine
WORKDIR /app
COPY . /app
RUN apk update \
  && apk upgrade \
  && apk add --no-cache \
    bash \
    curl \
    make \
  && yarn install
ENTRYPOINT [ "./scripts/entrypoint.sh" ]
