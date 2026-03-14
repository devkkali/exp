module.exports = {
  apps: [
    {
      name: 'pocket-budget',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./dev.db',
      },
    },
  ],
};
