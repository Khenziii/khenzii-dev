#!/bin/sh

# Start the app.
yarn install
docker compose up --detach 
yarn dev &
DEV_SERVER_PID=$!

# Run cypress' tests.
wait-on http://localhost:3000 --interval 5000 
cypress run 

# Shutdown the app.
docker compose down 
kill $DEV_SERVER_PID
