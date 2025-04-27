const userData = require('../models/userSchema')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
require('dotenv').config();

const registerUser = async (req, res) => {
    // res.send('user register successfully..!')
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ msg: "All field is required", success: false })
    }
    let existingUser = await userData.findOne({ email })
    if (existingUser) {
        return res.json({ msg: "this user is allready exist" })
    } else {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            let user = await userData.create({ name, email, password: hashPassword });
            res.json({ msg: "User registerd successfully", success: true, details: user })
        } catch (error) {
            res.json({ msg: "error in creating user ", success: false, error: error.message })
        }
    }
}

const loginUser = async (req, res) => {
    // res.send('user register successfully')
    let { email, password } = req.body;

    if (!email, !password) {
        return res.json({ msg: "All field is required", success: false })
    }
    try {
        let existingUser = await userData.findOne({ email })
        if (existingUser) {
            let comparePassword = await bcrypt.compareSync(password, existingUser.password)
            if (comparePassword) {
                let token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
                res.json({ msg: 'login successfully', success: true, user: existingUser, token: token })
            } else {
                res.json({ msg: 'invalid password', success: false })
            }
        }
        else {
            res.json({ msg: 'user not found please register', success: false })
        }
    } catch (error) {
        res.json({ msg: 'error in login user', success: false, error: error.message })
    }

}

const updateUser = async (req, res) => {
    // res.send('user register successfully')
    let Id = req.params._id;
    let { name, password } = req.body;
    if (Id) {
        let hashPassword = await bcrypt.hashSync(password, salt);
        let user = await userData.findByIdAndUpdate(Id, { $set: { name, password: hashPassword } }, { new: true })
        if (user) {
            res.json({ msg: 'user updated successfully', success: true, user })
        } else {
            res.json({ msg: 'user not found', success: false })
        }
    } else {
        res.json({ msg: 'invalid user id', success: false })
    }
}

const deleteUser = async (req, res) => {
    // res.send('user register successfully')
    let Id = req.params._id;
    if (Id) {
        let user = await userData.findByIdAndDelete(Id)
        if (user) {
            res.json({ msg: 'user deleted successfully', success: true, user })
        } else {
            res.json({ msg: 'user not found', success: false })
        }
    } else {
        res.json({ msg: 'invalid user id', success: false })
    }
}

const forgetPassword = async (req, res) => {
    // res.send("forget password function is running")
    const { email } = req.body;
    try {
        let user = await userData.findOne({ email });
        if (!user) {
            return res.json({ msg: "User not found", success: false });
        }
        let token = randomstring.generate(30);
        user.resetPasswordToken = token;
        await user.save();
        await sendEmail(email, token);
        res.json({ msg: "Reset password link sent to your email", success: true });
    } catch (error) {
        res.json({ msg: " error in Reset password ", success: false, error: error.message });
    }
}

async function sendEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.App_Email,
            pass: process.env.App_Password,
        },
    });
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.App_Email, // sender address
            to: email, // list of receivers
            subject: "Password reset request", // Subject line
            text: `please click the link below to choose a new password \n 
          http://localhost:8000/users/forgetpassword/${resetToken}`
        });
    }
    main().catch(console.error);
}

const verifyPasswordToken = async (req, res) => {
    // res.send("password reset token verify")
    let token = req.params.token;
    console.log(token);
    let user = await userData.findOne({ resetPasswordToken: token });
    console.log(user);
    if (user) {
        res.render('ForgetPassword', { token })
    } else {
        res.json({ msg: "token expired", success: false });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        let { token } = req.params
        // console.log(newPassword);
        // console.log(token);
        if (!token) {
            return res.json({ msg: "token is required", success: false })
        }
        if (!newPassword) {
            return res.json({ msg: "new password is required", success: false })
        }
        let user = await userData.findOne({ resetPasswordToken: token });
        let hashedPassword = bcrypt.hashSync(newPassword, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        await user.save();
        res.json({ msg: "password updated successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in updatind password", success: false, error: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    forgetPassword,
    verifyPasswordToken,
    resetPassword,
}
