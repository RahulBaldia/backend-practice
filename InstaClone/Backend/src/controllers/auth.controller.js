const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


async function registerController (req, res) {
    const { username, email, password, bio, profileImage } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {

    const message =
        isUserAlreadyExists.email === email
            ? "Email already exists"
            : "Username already exists";

    return res.status(409).json({
        message: message
    });
}

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    });

    const token = jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET, { expiresIn: '1d'}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User Registered",
        user:{
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    });
}

async function loginController (req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({ 
        $or: [
            {
              username: username
            },
            {
              email: email
            }
        ] })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })

    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
       return res.status(401).json({
        message: "Invalid password"
       })
    }

    const token = jwt.sign({
        id: user._id,
    },
        process.env.JWT_SECRET, {expiresIn:'1d'}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User Logined",
        user:{
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    });
}


module.exports = {
    registerController,
    loginController
}


