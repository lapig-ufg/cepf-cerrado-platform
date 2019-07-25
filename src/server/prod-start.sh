#!/bin/bash
export NODE_ENV=prod; nohup node app-cepf-cluster.js &> app.out &
