const { json } = require("express")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const os = require('os');

const login = async (req, res, next) => {
    const { username, password } = req.body
    console.log(os.hostname());
    try{
        const user = await User.findOne({username})
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({
                status: "fail",
                message: "Incorrect password"
            })
        }
        req.session.user = user
        res.status(200).json({
            status: "success"
        })

    }
    catch(err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

const signUp = async (req, res, next) => {
    const { name, username, email, password } = req.body
    console.log(os.hostname());
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const body = {
            name,
            username,
            email,
            password: hashedPassword
        }
        const newUser = await User.create(body)
        req.session.user = newUser
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                status: "fail",
                message: "Duplicate key error",
                value: err.keyValue
            })
        }
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

module.exports = {
    signUp,
    login
}