const express = require("express");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  parameterLimit: 100000,
  limit: "500mb",
});
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
var querysender = require("../utilities/querySender");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var answers = [];
var userRole = 0;
var userId;
var isUserValid = false;
const upload = multer({ dest: "uploads/", storage });

router.post("/user/login", urlencodedParser, async (req, res) => {
  let responseData = { success: false, message: "Unsuccessful" };
  let user = req.body;
  let query = `SELECT id, password, name, email, user_role FROM user WHERE email = '${user.email}' AND is_valid = 1 `;
  const result = await querysender.sendLoginQuery(query);

  // Quiz_id in questions table = 1 means that quiz is active

  if (result.length) {
    // role = 1 -> admin
    // role = 0 -> teacher
    bcrypt.compare(
      user.password,
      result[0].password,
      function (err, compareResult) {
        if (compareResult) {
          userRole = result[0].user_role;
          isUserValid = true;
          const tokenl = jwt.sign(
            {
              data: {
                username: result[0].name,
                email: result[0].email,
                role: result[0].role,
              },
            },
            "secret",
            { expiresIn: "12h" }
          );
          responseData = {
            success: true,
            token: tokenl,
            userRole,
            id: result[0].id,
          };
        }

        res.send(responseData);
      }
    );
  } else {
    responseData.message = "User not found.";
    res.send(responseData);
  }
});
router.post("/user/signUp", urlencodedParser, async (req, res) => {
  let newUser = req.body;
  const saltRounds = 10;
  const myPlaintextPassword = newUser.password;

  let query = `select count(*) from user where user.email='${newUser.email}' `;
  const result = await querysender.sendLoginQuery(query);

  if (result[0]["count(*)"] != 0) {
    res.send({
      message: "Email artıq istifadə oluunb",
      status: 400,
    });
  } else {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      let hashPassword = "";
      const isAdmin = newUser.isAdmin.length === 0 ? 0 : 1;
      bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
        hashPassword = hash;
        let query = `INSERT INTO \`user\`(\`email\`, \`name\`, \`surname\` ,\`password\`, \`phone_number\`, \`user_role\`, \`is_valid\`) VALUES ('${newUser.email}','${newUser.name}', '${newUser.surname}','${hashPassword}','${newUser.phoneNumber}', ${isAdmin}, 0 )`;
        querysender.sendFinalQuery(query, res);
      });
    });
  }
});

router.get("/admin/waiting-list", urlencodedParser, async (req, res) => {
  if (userRole === 1) {
    let query = "SELECT * FROM `user` WHERE user.is_valid = 0";
    querysender.sendFinalQuery(query, res);
  } else {
    res.send(401);
  }
});

router.post("/admin/update-user", urlencodedParser, async (req, res) => {
  if (userRole === 1) {
    data = req.body;
    let query = `UPDATE user SET is_valid=${data.status} WHERE id = ${data.id}`;
    querysender.sendFinalQuery(query, res);
  } else {
    res.send(401);
  }
});

router.post("/submit-answers", urlencodedParser, async (req, res) => {
  const { id: userId, userAnswers } = req.body;
  const numberOfAnswers = userAnswers.length;
  let score = 0;
  for (let index = 0; index < numberOfAnswers; index++) {
    if (userAnswers.charAt(index) == answers[index]) {
      score++;
    }
  }
  const scorePercent = Math.round((score * 100) / numberOfAnswers);
  let query = `UPDATE user SET answers='${Number(
    userAnswers
  )}', last_quiz_score=${scorePercent} WHERE id='${userId}';`;
  querysender.queryWithoutResponse(query, res);
  const correctAnswersAndScore = {
    answers,
    scorePercent,
  };
  res.status(201).send(correctAnswersAndScore);
});

router.post("/admin/send-quiz", upload.array("photos", 100), (req, res) => {
  if (userRole === 1) {
    let images = req.files;
    let quizDetails = req.query;
    let numberOfQuestions = images.length;
    const { quizDuration, quizName } = quizDetails;
    let trueAnswers = quizDetails.trueAnswers;
    resetQuestionsAndUsers(res);
    let values = "";
    images.forEach((item, index) => {
      let imgsrc = item.filename;
      if (index === numberOfQuestions - 1) {
        values += `('${imgsrc}', '${trueAnswers[index]}','1')`;
      } else {
        values += `('${imgsrc}', '${trueAnswers[index]}','1'),`;
      }
    });
    createNewQuiz(quizDuration, quizName);
    let query = `INSERT INTO questions( question_image, answer, quiz_id) VALUES ${values}`;
    querysender.sendFinalQuery(query, res);
  } else {
    res.send(401);
  }
});

const createNewQuiz = function (duration, name) {
  let query = "UPDATE quiz SET is_active = 0";
  querysender.queryWithoutResponse(query);
  query = `INSERT INTO quiz(name, duration, is_active) VALUES ('${name}', '${duration}', '1')`;
  querysender.queryWithoutResponse(query);
};

const resetQuestionsAndUsers = function () {
  let query = "UPDATE `questions` SET `quiz_id`='0'";
  querysender.queryWithoutResponse(query);
  query = "UPDATE `user` SET `attended_quiz` = '0'";
  querysender.queryWithoutResponse(query);
};

router.get("/get-quiz", urlencodedParser, async (req, res) => {
  userId = req.query.id;
  const attendedQuiz = await didUserAttendedQuiz();
  if (attendedQuiz) {
    res.status(406).send({
      message: "Siz mövcud olan son imtahana artıq giriş etmisiniz!",
    });
  } else {
    if (isUserValid) {
      let query =
        "SELECT questions.id, questions.answer, question_image, quiz.duration FROM `questions` JOIN quiz ON questions.quiz_id = quiz.is_active WHERE questions.quiz_id = 1";
      userAttendedQuiz();
      getQuestionsAndAnswers(query, res);
    } else {
      res.status(401).send({ message: "Sistemə daxil olun" });
    }
  }
});

router.get("/get-quiz-view", urlencodedParser, async (req, res) => {
  let query =
    "SELECT answer, question_image FROM `questions` WHERE quiz_id = 1";
  querysender.sendFinalQuery(query, res);
});

router.get("/user/statistics", urlencodedParser, async (req, res) => {
  let query = `SELECT id, name, surname, email, phone_number, last_quiz_score, attended_quiz, answers FROM user`;
  querysender.sendFinalQuery(query, res);
});

const getQuestionsAndAnswers = async function (query, res) {
  answers = [];
  const questionsAndAnswers =
    await querysender.submitAnswersAndGetCorrectAnswers(query);
  const userQuestions = [];

  questionsAndAnswers.forEach((value) => {
    let temp = {
      id: value.id,
      question_image: value.question_image,
      duration: value.duration,
    };
    userQuestions.push(temp);
    answers.push(value.answer);
  });

  res.status(201).send(userQuestions);
};

const didUserAttendedQuiz = async function () {
  let query = `SELECT attended_quiz FROM user WHERE id=${userId}`;
  const result = await querysender.checkUserQuizAttendance(query);
  return result === 1;
};
const userAttendedQuiz = function () {
  let query = `UPDATE user SET attended_quiz = '1' WHERE id=${userId}`;
  querysender.queryWithoutResponse(query);
};

module.exports = router;
