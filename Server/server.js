const express = require("express");
const cors = require("cors");
const port = 4000;
const connectDb = require("../Server/config/connect");
const app = express();
const userRouter = require("./Routes/userRoute")

connectDb();

app.use(cors())

app.get('/ping',(req,res)=>{
  res.send("Message: Pong")
})

app.use(express.json())

app.use("/",userRouter);


app.listen(port, () => {
console.log(`🚀 server running on PORT: ${port}`);
});


module.exports = app;
