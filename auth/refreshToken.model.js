const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String
    },
    userId: {
        type: String
    }
});

const RefreshToken = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = RefreshToken;