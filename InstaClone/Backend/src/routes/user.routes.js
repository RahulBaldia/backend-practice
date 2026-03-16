const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

// send follow request
router.post("/follow/:userId", authMiddleware, userController.createFollowController)

// accept follow request
router.patch("/follow/accept/:requestId", authMiddleware, userController.acceptFollowController)

// reject follow request
router.patch("/follow/reject/:requestId", authMiddleware, userController.rejectFollowController)

// pending requests
router.get("/follow/requests", authMiddleware, userController.getPendingRequestsController)

// unfollow
router.delete("/unfollow/:userId", authMiddleware, userController.deleteFollowController)

// followers
router.get("/followers/:userId", authMiddleware, userController.getFollowersController)

// following
router.get("/following/:userId", authMiddleware, userController.getFollowingController)

module.exports = router