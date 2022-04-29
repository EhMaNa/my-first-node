const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
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
    },
    Fname: {
        type: String,
        trim: true,
        maxlength: 20,
        default: ''
    },
    Lname: {
        type: String,
        trim: true,
        maxlength: 20,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 100,
        default: ''
    }
});

const User = mongoose.model('User', schema);
exports.User = User;