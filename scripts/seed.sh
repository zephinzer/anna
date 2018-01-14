#!/bin/sh
DB_UNAVAILABLE=1;

printf "waiting for host [${DB_HOST}] on port [${DB_PORT}] to be available...\n";

while :; do
  DB_UNAVAILABLE=$(nc -z -v -w3 "${DB_HOST}" "${DB_PORT}");
  if [ "$?" = "0" ]; then
    break;
  fi;
  printf ".";
  sleep 1;
done;

printf "\n";
./node_modules/.bin/knex seed:run