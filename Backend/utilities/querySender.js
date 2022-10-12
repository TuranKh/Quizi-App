const express = require("express");
const app = express();
var mysql = require('mysql');
var cors = require('cors');
const { query } = require("express");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "quiz_app"
});
app.use(cors())

const sendFinalQuery = (mysql, res) => {
    con.query(mysql, (err, result, fields) => {
        if (err) throw err;
        res.send(result)
    });
}



const postAllQuestion = (mysql) => {
    con.query(mysql, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
}

const sendLoginQuery = (mysql) => {
    return new Promise((resolve, reject) => {
        con.query(mysql, (err, result, fields) => {
            if (err) throw err;
            resolve(result)
        });
    })
}
function getOriginalPassword(mysql, res) {
    let final = "This is final"
    con.query(mysql, (err, result, fields) => {
        if (err) throw err;
        console.log(result[0].password)
        final += result[0].password

    });
    console.log(final)
    return final;

}


exports.sendFinalQuery = sendFinalQuery;
exports.getOriginalPassword = getOriginalPassword;
exports.sendLoginQuery = sendLoginQuery;
exports.postAllQuestion = postAllQuestion