const express = require('express');
const app = new express();
const User = require('./models/User.js')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



dotenv.config();
app.use(express.json())

mongoose.connect(process.env.MONGO_URL,{
    serverSelectionTimeoutMS: 20000,
}).then(console.log("Database connected !")).catch((err)=>{console.log(err)});




//Login / Register routes handling

app.post('/register',async (req,res)=>{
    try{
        const salt = bcrypt.genSalt(10);
        const hashedPass =await  bcrypt.hash(req.body.password,salt)
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({email:email,password:hashedPass});
        const newUser = await user.save();
        res.status(200).json(newUser);
    }catch(er){
        res.send('Some error occured : '+ er);
    }
});

app.post('/login',async(req,res)=>{
    try{

        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(400).json('Wrong Credentials !')
        }
    const isValidated = await bcrypt.compare(req.body.password,user.password);
    if(!isValidated){
        res.status(400).json("Wrong Password")
    };
    res.status(200).json('Successfully Logged In')
}catch(err){
    res.status(500).json(err);
}
})


const PORT = 4000;
app.listen(PORT,()=>{console.log('Server running on ' + PORT)});