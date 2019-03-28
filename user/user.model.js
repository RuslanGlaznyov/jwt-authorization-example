const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;