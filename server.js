const express = require('express');
const keys = require("./config/keys.js");

const app = express();

//Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//setup databse models
require('./model/Account');

//setup the routes
require('./routes/authenticationRoutes.js')(app);

app.listen(keys.port, () => {
    console.log("listening on port " + keys.port);
})