const mongoose = require("mongoose");
const Account = mongoose.model("accounts");
const argon2 = require("argon2");
const bcrypt = require("bcrypt");

module.exports = (app) => {
  //login route
  app.post("/account/login", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (username == null || password == null) {
      res.send("Invalid Credentials");
      return;
    }

    var userAccount = await Account.findOne({ username: username });
    if (userAccount != null) {
      // Load hash from your password DB.
      bcrypt.compare(
        password, //plaintext password
        userAccount.password, //hash
        async function (err, result) {
          // result == true
          if (result) {
            userAccount.lastAuthentication = Date.now();
            await userAccount.save();

            console.log("Retrieving Account");
            res.send(userAccount);
            return;
          } else {
            res.send("Invalid Credentials");
            return;
          }
        }
      );
    }
  });

  //
  app.post("/account/create", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (username == null || password == null) {
      res.send("Invalid Credentials");
      return;
    }

    var userAccount = await Account.findOne({ username: username });

    if (userAccount == null) {
      //Create new account
      console.log("Create new Account...");

      //generate a unique access token
      var saltRounds = 8;
      var accountSalt = null;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        accountSalt = salt;
        bcrypt.hash(password, accountSalt, async function (err, hash) {
          // Store hash in your password DB.
          var newAccount = new Account({
            username: username,
            password: hash,
            salt: salt,

            lastAuthentication: Date.now(),
          });

          await newAccount.save();
          res.send(newAccount);
          return;
        });
      });
    } else {
      res.send("username is already taken");
    }
  });
};
