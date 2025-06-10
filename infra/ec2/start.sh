npx tsc

npx prisma migrate deploy

pm2 start ./infra/ec2/ecosystem.config.js

pm2 save
