const mongoose = require('mongoose')

const connectToDb = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/LocalBharat')
    .then(()=>console.log("dataBase is connected successfully"))
    .catch(()=>console.log("error in connecting to dataBase"))
}

module.exports = connectToDb;