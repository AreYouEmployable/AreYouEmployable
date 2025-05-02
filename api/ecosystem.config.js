export const apps = [
    {
        name: 'employable',
        script: './app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
            ENVIRONMENT: 'development',
            PORT: 3000
        },
        env_production: {
            ENVIRONMENT: 'production',
            PORT: 8000
        }
    }
];