const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
   caption: {
    type: String,
    default: ""
   },
   imageUrl: {
    type: String,
    required: [true, "imageUrl is required for creating a post"]
   },
   users:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "userId is required for creating a post"]
   }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel