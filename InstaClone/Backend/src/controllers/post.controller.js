const postModel = require('../models/post.model')
const Imagekit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imageKit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createpostController(req, res) {

    console.log(req.body, req.file);

    const file = await imageKit.files.upload({
        file: await toFile(req.file.buffer, "file"),
        fileName: "file",
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imageUrl: file.url,
        users: req.user.id
    });

    res.status(201).json({ message: "Post created successfully", post });
}

async function getPostController(req, res) {

    const posts = await postModel.find({ users: req.user.id });

    res.status(200).json({ message: "Posts fetched successfully", posts });
}

async function getPostDetailsController(req, res) {

    const post = await postModel.findById(req.params.id);

    if(!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    if(post.users.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden access" })
    }

    res.status(200).json({ message: "Post details fetched successfully", post });
}

module.exports = {
    createpostController,
    getPostController,
    getPostDetailsController
}