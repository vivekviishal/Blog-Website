const mongoose = require("mongoose");
// const {Schema} = mongoose;
const userSchema = new mongoose.Schema({
    username:String,
    email: String,
    password: String,
    verificationToken: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
})

module.exports = mongoose.model("User", userSchema);