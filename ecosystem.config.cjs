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
        AUTH_BOOTSTRAP_USERNAME: 'admin',
        AUTH_BOOTSTRAP_PASSWORD: 'change_me_now',
        AUTH_SECRET: 'change_me_auth_secret',
      },
    },
  ],
};
