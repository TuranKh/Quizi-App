const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
app.use("/images", express.static(path.join(__dirname, "uploads")));
var bodyParser = require("body-parser");

const cors = require("cors");
const router = require("../router/router");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json()); // getting empty post request
var mysql = require("mysql");
app.use(router);

var con = mysql.createConnection({
  host: "65.108.246.46",
  user: "root",
  password: "turan",
  database: "quiz_app",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query(
  `SELECT * FROM questions where id = ?`,
  [2],
  (err, result, fields) => {
    if (err) {
      return err;
    }
    return result;
  }
);

app.listen(8000, () => {
  console.log("server started");
});
