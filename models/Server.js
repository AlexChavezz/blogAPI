const express = require('express');
const cors = require('cors');

class Server {
    constructor()
    {
        this.app = express();
        this.port = process.env.PORT || 8080;

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }
    middlewares()
    {
        this.app.use( express.json() );        
        this.app.use( cors() );
    }
    routes()
    {
        this.app.use('', require('../routes/users.routes'));
    }
    listen()
    {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}


module.exports = Server;