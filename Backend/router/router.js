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
var userRole = 0;
var isUserValid = false;
const upload = multer({ dest: "uploads/", storage });

router.post("/user/login", urlencodedParser, async (req, res) => {
  let responseData = { success: false, message: "Unsuccessful" };
  let user = req.body;
  let query = `SELECT id, password, name, email, user_role FROM user WHERE email = '${user.email}' AND is_valid = 1 `;
  const result = await querysender.sendLoginQuery(query);

  if (result.length) {
    // role = 1 -> admin
    // role = 0 -> teacher
    bcrypt.compare(
      user.password,
      result[0].password,
      function (err, compareResult) {
        if (compareResult) {
          userRole = result[0].user_role;
          console.log(userRole, " colde");
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
  const userAnswers = req.body;
  let query = `UPDATE user SET answers='${userAnswers.answers}' WHERE id='${userAnswers.id}';`;
  querysender.sendFinalQuery(query, res);
});

router.post("/admin/send-quiz", upload.array("photos", 100), (req, res) => {
  console.log(userRole);
  if (userRole === 1) {
    let images = req.files;
    let quizDetails = req.query;
    let quizName = quizDetails.quizName;
    let quizDuration = quizDetails.quizDuration;
    let trueAnswers = quizDetails.trueAnswers;

    images.forEach((item, index) => {
      let imgsrc = item.filename;
      let query = `INSERT INTO questions( question_image, answer, quiz_id) VALUES ('${imgsrc}', '${trueAnswers[index]}','1')`;
      querysender.sendFinalQuery(query, res);
    });
  } else {
    console.log("error ");
    res.send(401);
  }
});

router.get("/get-quiz", urlencodedParser, async (req, res) => {
  if (isUserValid) {
    let query = "SELECT id, question_image FROM `questions` WHERE quiz_id = 1";
    querysender.sendFinalQuery(query, res);
  } else {
    res.status(401).send({ message: "Sistemə daxil olun" });
  }
});

router.get("/duration", urlencodedParser, async (req, res) => {
  let query = "SELECT `duration` FROM `quiz` WHERE id = 1";
  querysender.sendFinalQuery(query, res);
});

module.exports = router;
