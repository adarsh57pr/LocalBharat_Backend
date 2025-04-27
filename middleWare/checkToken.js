const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.json({ msg:"token not found", success: false })
        }
        let decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode)
        req.user = decode
        next()
    } catch (error) {
        return res.json({ msg: "invalid token", success: false })
    }
}


module.exports = checkToken