const express = require("express");
const app = express();
var mysql = require("mysql");
var cors = require("cors");
const { query } = require("express");
var con = mysql.createConnection({
  host: "65.108.246.46",
  user: "root",
  password: "turan",
  database: "quiz_app",
});
app.use(cors());

const sendFinalQuery = (mysql, res) => {
  con.query(mysql, (err, result, fields) => {
    if (err) throw err;
    res.send(result);
  });
};

const queryWithoutResponse = (mysql) => {
  con.query(mysql, (err, result) => {
    if (err) throw err;
    return result;
  });
};

const submitAnswersAndGetCorrectAnswers = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};
const checkUserQuizAttendance = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result) => {
      if (err) throw err;
      try {
        resolve(result[0].attended_quiz);
      } catch (error) {}
    });
  });
};

const sendLoginQuery = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result, fields) => {
      if (err) throw err;
      resolve(result);
    });
  });
};

function getOriginalPassword(mysql, res) {
  con.query(mysql, (err, result, fields) => {
    if (err) throw err;
    final += result[0].password;
  });
  return final;
}

exports.sendFinalQuery = sendFinalQuery;
exports.getOriginalPassword = getOriginalPassword;
exports.sendLoginQuery = sendLoginQuery;
exports.queryWithoutResponse = queryWithoutResponse;
exports.checkUserQuizAttendance = checkUserQuizAttendance;
exports.submitAnswersAndGetCorrectAnswers = submitAnswersAndGetCorrectAnswers;
