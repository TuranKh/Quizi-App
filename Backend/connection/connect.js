const config = {
  host: "65.108.246.46",
  port: "3306",
  user: "root",
  password: "turan",
  database: "quiz_app",
  pool: true, // true if you want to use pools
  connectionLimit: 100, // you can add any other node mysql settings here.
};

const label = "default";

const db = require("n3-node-mysql-singleton").getInstance(config, label);
