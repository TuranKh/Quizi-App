const express = require("express");
const app = express();
var cors = require("cors");
const con = require("n3-node-mysql-singleton").getInstance("default");

app.use(cors());

const sendFinalQuery = (mysql, res) => {
  con.query(mysql, (err, result, fields) => {
    if (err) throw err;
    con.release();
    res.send(result);
  });
};

const queryWithoutResponse = (mysql) => {
  con.query(mysql, (err, result) => {
    if (err) throw err;
    con.release();
    return result;
  });
};

const submitAnswersAndGetCorrectAnswers = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result) => {
      if (err) throw err;
      resolve(result);
      con.release();
    });
  });
};
const checkUserQuizAttendance = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result) => {
      if (err) throw err;
      try {
        resolve(result[0].attended_quiz);
        con.release();
      } catch (error) {}
    });
  });
};

const sendLoginQuery = (mysql) => {
  return new Promise((resolve, reject) => {
    con.query(mysql, (err, result, fields) => {
      if (err) throw err;
      resolve(result);
      con.release();
    });
  });
};

function getOriginalPassword(mysql, res) {
  con.query(mysql, (err, result, fields) => {
    if (err) throw err;
    final += result[0].password;
    con.release();
  });
  return final;
}

exports.sendFinalQuery = sendFinalQuery;
exports.getOriginalPassword = getOriginalPassword;
exports.sendLoginQuery = sendLoginQuery;
exports.queryWithoutResponse = queryWithoutResponse;
exports.checkUserQuizAttendance = checkUserQuizAttendance;
exports.submitAnswersAndGetCorrectAnswers = submitAnswersAndGetCorrectAnswers;
