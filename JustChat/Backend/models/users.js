const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: String,
    lastName: String,
    password: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("User", userSchema)