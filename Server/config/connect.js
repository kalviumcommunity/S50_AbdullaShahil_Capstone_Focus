const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const connectDb = () =>{

    mongoose.connect(uri)
    .then(()=>{
        console.log('Database is connected successfully')
    }).catch((err)=>{
        console.log(err)
    })

}
module.exports = connectDb;