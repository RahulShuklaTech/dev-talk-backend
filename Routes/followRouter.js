require('dotenv').config();
const express = require('express');
const {  followUser, getFollowerSuggestions } = require('../Controllers/UserController');
const jwt = require("jsonwebtoken");

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








router.post("/:toFollow",validateRequest, async (req,res) => {
    const {toFollow} = req.params;
    console.log("toFollow",toFollow);

    try {
        
        let action = await followUser(toFollow,req.username)
        console.log("action",action)
        if(action.status && action.result.message3) {
            res.status(200).json({message: "Followed user"+action.result.message3})
        }else if(action.status && !action.result.message3) {
            res.status(200).json({message: "User unfollowed"+action.result.message3})
        }else{
            res.status(400).json({message: action.result.message})
        }  
        
    }catch(e){
        res.status(400).json({message: e.message})
    }
})



router.get('/',validateRequest, async (req, res) => {
    try {
        
        
        let followerSuggestions = await getFollowerSuggestions(req.username);
        res.status(200).json({message: followerSuggestions.result.message})
    }catch(e){
        console.log("error",e.message)
        res.status(403).json({message: "Error while getting suggestions"+e.message})
    }
})



module.exports = router