const Config = {
    server: process.env.server,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.user_name,
            password: process.env.password
        }
    },
    options: {
        encrypt: true,
        database: process.env.database,
    }
}


module.exports = Config;