const express = require('express')
const app = express();
const port = 8000;
const dbConnection = require('./dataBase');
const cors = require('cors')
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
dbConnection();
app.use(cors())
app.use(express.json({limit:'50mb'}))

app.get('/',(req,res)=>{
    res.send("welcome backend")
})

app.use('/users',userRouter);
app.use('/products',productRouter); 

app.listen(port,()=>{
    console.log(`server is running on port at http://localhost:${port}`)
})