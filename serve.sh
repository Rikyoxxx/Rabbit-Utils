#!/bin/bash

#stop the server
pm2 delete rabbit-utils

# reinstall dependencies
rm -rf node_modules
npm install

# build with develop environment
rm -rf dist
npm run build

export WEB_PORT=6001

# start the server
pm2 start npm --name "rabbit-utils" -- run serve