const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const {sign} = require('jsonwebtoken');
const {validateAccessToken} = require('../middlewares/AuthMiddleware');

// router.get('/getalluser', async (req, res) => {
//     const users = await User.findAll();
//     res.json(users);
// });

const jwtDecode = (token) => {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
}

router.get('/user/:id', validateAccessToken ,async (req, res) => {
    const id = req.params.id;
    const accessToken = req.header("accessToken");

    try {
        var payload = jwtDecode(accessToken);
        if(payload.id == id){
            const user = await User.findByPk(id);
            const {name, address, pincode, weight, mobile, email, password} = user;

            res.json({
                name: name,
                address: address,
                pincode: pincode,
                weight: weight,
                mobile: mobile,
                email: email
            });

        } else {
            res.json({error: "Invalid user!"});
        }
        
    } catch (error) {
        res.json({error: error});
    }
    
});

router.post('/register', async (req, res) => {
    const {name, address, pincode, weight, mobile, email, password} = req.body;
    const user = await User.findOne({ where: { email: email} });

    if(user) {
        res.json({error: "Email address " + email + " is already taken! \nPlease try registering with another email or Login."});
    } else {
         bcrypt.hash(password, 10).then(async (hash) => {
         await  User.create({
                name: name,
                address: address,
                pincode: pincode,
                weight: weight,
                mobile: mobile,
                email: email,
                password: hash
            });

            const user = await User.findOne({ where: { email: email} });

            const accessToken = sign({ name: user.name, id: user.id}, "signingKeyForJsonWebToken");

            res.json(accessToken);
        })
    }

   
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email} });

    if(!user) {
         res.json({error: "User with email " + email + " doesn't exists!"})
    } else {
        bcrypt.compare(password, user.password).then((match) => {
            if(!match) { 
                res.json({error: "Password is incorrect! Please doublecheck the password you have entered."})
            } else {
                const accessToken = sign({ name: user.name, id: user.id}, "signingKeyForJsonWebToken");

                res.json(accessToken);
            }
        })
    }
       
    
    
})


module.exports = router;