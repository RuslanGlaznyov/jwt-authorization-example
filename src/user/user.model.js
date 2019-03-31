const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
}, { versionKey: false });

//hashing password
userSchema.pre("save", function (next) {
    //check if Modified field password
    if(!this.isModified("password")) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err){
                reject(new Error("Error checking user password"));
            }else{
                resolve(isMatch);
            }
        });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;