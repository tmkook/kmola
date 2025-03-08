module.exports = {
    koa: {
        env: process.env.APP_ENV ?? 'development',
        keys: [process.env.APP_KEY ?? 'your-secret-key'],
        proxy: true,
        subdomainOffset: 2,
        proxyIpHeader: 'X-Forwarded-For',
        maxIpsCount: 1,
    },
    router: {
        host: null,
        prefix: '',
        exclusive: false,
    },
    session: {
        key: 'sessionid',
        maxAge: 3600000,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: true,
        store: null,
    },
    logger: {
        level: process.env.APP_LOG ?? 'info',
        silent: false,
        transports: [
            { filename: process.cwd() + "/storage/logs/kmola.log", maxSize: '50m', maxFiles: 7, zippedArchive: true }
        ]
    },
    locale: {
        key: "lang",
        default: "zh",
    }
}