#!/bin/sh

NODE_ENV=test

# Start the app.
yarn install
docker compose up --detach
yarn dev &
DEV_SERVER_PID=$!

# Run cypress' tests.
wait-on http://localhost:3000 --interval 5000
cypress run
CYPRESS_EXIT_CODE=$?

# Shutdown the app.
docker compose down
kill $DEV_SERVER_PID

exit $CYPRESS_EXIT_CODE
