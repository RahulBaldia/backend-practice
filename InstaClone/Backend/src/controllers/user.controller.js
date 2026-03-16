const userModel = require('../models/user.model')
const followModel = require("../models/follow.model")

// Send follow request
async function createFollowController(req, res) {

    const follower = req.user.id
    const followee = req.params.userId

    if (follower === followee) {
        return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const existingFollow = await followModel.findOne({
        follower,
        followee
    })

    if (existingFollow) {
        return res.status(400).json({ message: "Follow request already sent" })
    }

    const follow = await followModel.create({
        follower,
        followee,
        status: "pending"
    })

    res.status(201).json({
        message: "Follow request sent",
        follow
    })
}


// Accept follow request
async function acceptFollowController(req, res) {

    const requestId = req.params.requestId

    const request = await followModel.findByIdAndUpdate(
        requestId,
        { status: "accepted" },
        { new: true }
    )

    if (!request) {
        return res.status(404).json({ message: "Request not found" })
    }

    res.status(200).json({
        message: "Follow request accepted",
        request
    })
}


// Reject follow request
async function rejectFollowController(req, res) {

    const requestId = req.params.requestId

    const request = await followModel.findByIdAndUpdate(
        requestId,
        { status: "rejected" },
        { new: true }
    )

    if (!request) {
        return res.status(404).json({ message: "Request not found" })
    }

    res.status(200).json({
        message: "Follow request rejected",
        request
    })
}


// Unfollow
async function deleteFollowController(req, res) {

    const follower = req.user.id
    const followee = req.params.userId

    const follow = await followModel.findOneAndDelete({
        follower,
        followee
    })

    if (!follow) {
        return res.status(404).json({ message: "Follow relationship not found" })
    }

    res.status(200).json({
        message: "User unfollowed successfully"
    })
}


// Get followers (only accepted)
async function getFollowersController(req, res) {

    const userId = req.params.userId

    const followers = await followModel.find({
        followee: userId,
        status: "accepted"
    }).populate("follower")

    res.status(200).json({
        message: "Followers fetched successfully",
        followers
    })
}


// Get following (only accepted)
async function getFollowingController(req, res) {

    const userId = req.params.userId

    const following = await followModel.find({
        follower: userId,
        status: "accepted"
    }).populate("followee")

    res.status(200).json({
        message: "Following fetched successfully",
        following
    })
}


// Get pending requests
async function getPendingRequestsController(req, res) {

    const userId = req.user.id

    const requests = await followModel.find({
        followee: userId,
        status: "pending"
    }).populate("follower")

    res.status(200).json({
        message: "Pending requests fetched",
        requests
    })
}

module.exports = {
    createFollowController,
    deleteFollowController,
    getFollowersController,
    getFollowingController,
    acceptFollowController,
    rejectFollowController,
    getPendingRequestsController
}