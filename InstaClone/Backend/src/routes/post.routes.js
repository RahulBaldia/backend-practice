const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })


postRouter.post('/', authMiddleware, upload.single("image"), postController.createpostController)

postRouter.get('/', authMiddleware, postController.getPostController)

postRouter.get('/details/:id', authMiddleware, postController.getPostDetailsController)

module.exports = postRouter