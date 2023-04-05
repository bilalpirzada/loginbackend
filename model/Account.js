const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
       adminFlag: Number,
    username: String,
    password: String,
    lastAuthentication: Date,
});

mongoose.model('accounts', accountSchema);