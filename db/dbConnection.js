const  Config = require("./db.config");
const { Connection } = require('tedious');

const connection = new Connection(Config);
module.exports = connection;