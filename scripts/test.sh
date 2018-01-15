#!/bin/sh
CURR_DIR=$(dirname $0);
MOCHA_VERSION=$(mocha -V);

printf "working directory        : $(pwd)\n";
printf "script directory         : ${CURR_DIR}\n";
printf "using mocha              : ${MOCHA_VERSION}\n";
printf "test run started on      : $(date +'%d-%m-%Y %H:%M:%S')\n";

istanbul cover --report lcov \
  ./node_modules/.bin/_mocha -- \
    --reporter dot \
    --forbid-only \
    --forbid-pending \
    "./test/entrypoint.js" \
    "./test/**/*.test.js";