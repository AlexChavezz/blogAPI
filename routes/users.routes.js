const { Router } = require('express');
// const connection = require('../db/dbConnection');
const router = Router();
const Config = require("../db/db.config");
const { Request, TYPES, Connection } = require('tedious');

router.get('/', (req, res) => {
    const connection = new Connection(Config);
    connection.on("connect", (error) => {
        if (error) {
            console.log(error);
            connection.close();
        } else {
            const request = new Request("SELECT * FROM Followers;", (error) => {
                if (error) {
                    console.log(error);
                    connection.close();
                    return res.status(500).json({ message: "Internal server error" });
                }
            });
            let followers = [];
            let currentFollower = {};
            request.on('row', (columns) => {
                columns.forEach(column => {
                    currentFollower[column.metadata.colName] = column.value;
                });
                followers = [...followers, currentFollower];
                currentFollower = {};
            });
            request.on("requestCompleted", function () {
                connection.close();
                return res.status(200).json(followers);
            })
            connection.execSql(request);
        }
    });
    connection.connect();
});

router.post('/', (req, res) => {

    const { userName, email } = req.body;
    const connection = new Connection(Config);

    connection.on("connect", (error) => {
        if (error) {
            // console.log(error);
            res.status(500).json({ error: "Server Error, try again later" });
            //close connection
            connection.close();
        } else {
            const request = new Request("INSERT INTO Followers (userName, email) VALUES(@userName, @email);", (error, rowCount) => {
                if (error) {
                    connection.close();
                    return res.status(500).json({ error: "Server Error, try again later" });
                }
                return res.status(200).json({ message: "User saved" });
            });
            request.addParameter("userName", TYPES.VarChar, userName);
            request.addParameter("email", TYPES.VarChar, email);
            connection.execSql(request);
        }
    });
    connection.connect();
});

module.exports = router;