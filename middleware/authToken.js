const jwt = require('jsonwebtoken')
const User = require('../model/User')

const authToken = function(req,res,next){
    const token = req.header('token')
    if (!token) return res.status(400).send({error:'Access Denied !!'})
    try {
        const verifyToken = jwt.verify(token,process.env.TOKEN_SECRATE)
        req.user = verifyToken
        next();
    } catch (error) {
        res.status(401).send({error: 'Token is not Verified !! '})
    }
}
module.exports = authToken;