const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser, forgetPassword, verifyPasswordToken, resetPassword } = require('../controllers/userController');

const router = express.Router();

router.post('/createUser', registerUser)
router.post('/loginUser',loginUser)
router.put('/updateUser/:_id',updateUser)
router.delete('/deleteUser/:_id',deleteUser)
router.post('/forgetpassword',forgetPassword)
router.get('/forgetpassword/:token',verifyPasswordToken)
router.post('/resetpassword/:token',resetPassword)

module.exports = router;