const express = require("express");
const path = require("path");
const app = express();
app.use("/images", express.static(path.join(__dirname, "uploads")));
var bodyParser = require("body-parser");

const config = require("../connection/connect");
const label = "default";
const db = require("n3-node-mysql-singleton").getInstance(label);
const cors = require("cors");
const router = require("../router/router");
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json()); // getting empty post request
var mysql = require("mysql");
app.use(router);

app.listen(8000, () => {
  console.log("server started");
});
