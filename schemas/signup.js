const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        minlength: 7,
        required: true,
    }

})

const User = mongoose.model('User', schema);
exports.User = User;