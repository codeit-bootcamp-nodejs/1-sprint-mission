module.exports = {
  apps: [
    {
      name: 'mission10-app',
      script: 'dist/main.js',
      // instances: 1,
      // exec_mode:
      watch: false,
      env: {
        NODE_ENV: 'development',
        // PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        // PORT: 80,
      },
    },
  ],
};
