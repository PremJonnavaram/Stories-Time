const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
},{timestamps: true});


const Posts = mongoose.model("Posts" , PostSchema);
module.exports = Posts;