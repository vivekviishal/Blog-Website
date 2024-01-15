const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = Schema({
    title: String,
    content: String,
    isPost:Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Blog", blogSchema);
