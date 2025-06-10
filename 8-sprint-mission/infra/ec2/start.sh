#!/bin/bash

npm run build

pm2 start infra/ec2/ecosystem.config.js