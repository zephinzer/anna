FROM node:8.9.4-alpine
WORKDIR /app
COPY . /app
RUN yarn install --production \
  && yarn autoclean
ENTRYPOINT [ "./scripts/entrypoint.sh" ]