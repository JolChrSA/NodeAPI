const router = require('express').Router();
const User = require('../model/User');
const authToken = require('../middleware/authToken') 


//For SignUp| Register 

router.post('/register',async(req, res)=> {

    //Check Email is allredy exists or not
    const emailExist = await User.findOne({email:req.body.email})
    if (emailExist){
        return res.status(400).send({error: 'Email is Alredy exists'})
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const saveUser = await user.save();
        const token = await user.generateAuthToken()
        res.send(saveUser);
    } catch (error) {
       res.status(400).send({message:error.message}) 
    }
})

// Login 
router.post('/login', async(req,res)=> {
    try {
        const user = await User.findLoginCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        console.log(token);
        res.send(user)
    } catch (error) {
        res.status(401).send({error: "Email or Password are Incorrect !!!"})
    }

})

  //Update 
router.post('/changePassword', authToken, async(req,res) => {
    console.log('Change Passwod ');
    try {
        const user = await User.changeNewPassword(req.body.email,req.body.password)
        console.log(user);
        res.json({message: 'Password Change Succesfully !!!'})
    } catch (error) {
        res.status(401).send({error: error})
    }
})

//LogOut
router.post('/logout', authToken , async (req,res) => {
    try {
        User.findByIdAndRemove(req.user._id, function(err){
            if(err) res.send(err);
            res.json({ message: 'User Deleted!'});
           })
    
    } catch (error) {
         res.status(501).send()   
    }
})


module.exports = router;