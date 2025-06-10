module.exports = {
  apps: [
    {
      name: 'pandamarket-api',
      script: './build/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
