const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        unique: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid Email Id')
            }
        }
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        validate(value){
            if (value < 7){
                throw new Error('Password must be Greter than 7 ')
            }
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
})

//Use Hashing Method for Password 
userSchema.pre('save',async function(next){
    const user = this
    console.log('Just before saving');
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next();
})

//Method for Generate Token
userSchema.methods.generateAuthToken = async function(){
    const user = this 
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRATE);
    user.token = token
    await user.save();
    return token
}

//Method  for Login Credenatils 
userSchema.statics.findLoginCredentials = async (email,password) => {

    const user = await User.findOne({email: email})
    if (!user) throw new Error('User Not Found')
    console.log(user);
    console.log(user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('User Not Found')
    return user
}

//Method for Chnage Password 
userSchema.statics.changeNewPassword = async (email,password) => {

    const user = await User.findOne({email: email})
    if (!user) throw new Error('User Not Found')
 
    //if (user.isModified('password')){
        user.password = await bcrypt.hash(password,8)
  //  }
   await user.save();
  return user.password
}

const User = mongoose.model('User',userSchema);
module.exports = User;