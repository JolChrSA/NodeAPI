const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true
},(error,client) => {
    if (error){
       return console.log('Unable to connect Database');
    }
    console.log('Connected to database');
    
})
