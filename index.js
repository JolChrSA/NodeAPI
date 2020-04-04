const express = require('express')
require('./db/mongoose')

const app = express()
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post')
//Middleware
app.use(express.json());
//Route Miidleware 
app.use('/api/user',authRoute);
app.use('/api/post', postRoute);

app.listen(3000,() => {
    console.log('Server is Running');
})