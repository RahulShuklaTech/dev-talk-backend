require('dotenv').config();
const express = require('express');
const { findUser } = require('../Controllers/UserController');
const router = express.Router();


const validateRequest = (req, res, next) => { 
    let authHeader = req.headers.authorization;
    console.log(authHeader,req.body);
    if (!authHeader) { 
        return res.status(403).json({
            message: "You must be logged in to perform this action"
        });
    }
    let token = authHeader.split(" ")[1];
    if(!token){
        return res.status(403).json({
            message: "No Token in request"
        });
    }
    try {
        let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.username = decoded.username;
        console.log("decode username",decoded.username);
        next();
    }catch(err){
        console.log("err in validation",err);
        return res.status(403).json({
            
            message: "Token is invalid "+err.message
        });
    }
}


router.get("/:user", async (req, res) => {
    const {user} = req.params;
    const userFound = await findUser(user)
    res.status(200).json({userFound});
})


router.get("/", async (req,res) => {
    res.status(200).json({messsage: "Hello World!"})
})





module.exports = router