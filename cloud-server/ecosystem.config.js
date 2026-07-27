module.exports = {
  apps: [
    {
      name: 'multitool-cloud',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3077,
        MULTITOOL_API_KEY: 'mtc_sk_24fe2f8b30d8ea5943a45e5c4cac5193054b'
      }
    }
  ]
};