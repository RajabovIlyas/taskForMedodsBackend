module.exports = {
    appPort: 3000,
    mongoUri: 'mongodb://localhost/token',
    jwt: {
        secret: '5e7a2eb53b92a881e87b3a1b',
        tokens: {
            access: {
                type: 'access',
            },
            refresh: {
                type: 'refresh',
            },
            alg: {
                algorithm: 'HS512'
            },
        },
    },
};
