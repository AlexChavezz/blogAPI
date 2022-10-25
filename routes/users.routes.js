const { Router } = require('express');
const connection = require('../db/dbConnection');
const router = Router();
const { Request, TYPES } = require('tedious');

router.get('/', (req, res) => {
    const followers = [];
    connection.on("connect", (error) => {
        if (error) {
            console.log(error)
            connection.close();
        } else {
            console.log("trying to execute query");
            followers = executeQuery(connection);
        }
    });
    res.status(200).json(followers);
});

router.post('', (req, res) => {

    const { name, email } = req.body;

    connection.on("connect", (error) => {
        if(error)
        {   
            // console.log(error);
            res.status(500).json({error: "Server Error, try again later"});
            //close connection
            connection.close();
        } else {
            const request = new Request("INSERT INTO followers (name, email) VALUES(@name, @email);", (error, rowCount) => {
                if(error){
                    // console.log(error);
                    //close connection
                    connection.close();
                    return res.status(500).json({error: "Server Error, try again later"});
                }
                return res.status(200).json({message: "User saved"});
            });
            request.addParameter("name", TYPES.VarChar, name);
            request.addParameter("email", TYPES.VarChar, email);
            connection.execSql(request);
        }
    });
});


function executeQuery(connection) {
    const request = new Request("SELECT * FROM followers", (error, rowCount) => {
        if (error) {
            console.log(error);
        } else {

            connection.close();
        }
    });
    const followers = [];
    const currentFollower = {};
    request.on('column', (columns) => {
        columns.forEach(column => {
            currentFollower[column.metadata.colName] = column.value;
        });
        followers = [...followers, currentFollower];
    });
    request.on("requestCompleted", function () {
        connection.close();
        return followers;
    })
    connection.execSql(request);
}

module.exports = router;