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

// hashing sync password
// userSchema.pre("save", function (next) {
//     //check if Modified field password
//     if(!this.isModified("password")) {
//         return next();
//     }
//
//     this.password = bcrypt.hashSync(this.password, 10);
//     next();
// });


//hashing async password
//from mongodb blog
//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
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