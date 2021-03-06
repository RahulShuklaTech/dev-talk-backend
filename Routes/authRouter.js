require('dotenv').config();
const express = require('express');
const multer = require('multer');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {signUp,loginUser} = require('../Controllers/UserController');
const { addRefreshToken, removeRefreshToken, findRefreshToken } = require('../Controllers/RefreshTokenController');
let avatarName = ""
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       
        cb(null, "./public/uploads/")
    },
    filename: function (req, file, cb) {
        let type = file.originalname.split('.').pop();
        avatarName = req.body.username + "." + type;     
        cb(null, avatarName)
    }
})

const multipart = multer({ storage: storage });



router.post("/signup",multipart.single("avatar"), async (req,res) => {
    let {name,username,email,password,avatar} = req.body;
    let user = await signUp({name,username,email,password,avatar,filename: avatarName});
    if(user.status){
        
        res.status(201).json(user.result.message);
    }else{
        res.status(400).json(user.result.message);
    }
    
})

router.post("/login",multipart.single("avatar"), async (req,res) => {
    let response = await loginUser(req.body);
    if(response.status){
        let payload = {email: response.result.message.email, username: response.result.message.username}
        let token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRY});
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
        let temp = await addRefreshToken({email: payload.email,token: refreshToken,username: payload.username});
        res.status(201).json({token: token, refreshToken: refreshToken, userId: response.result.message._id});
    }else{
        res.status(400).json(response.result);
    }

})

router.post("/logout", async (req,res) => {
    console.log("req body",req)
    let response = await removeRefreshToken(req.body);
    console.log("Response", response);
    if(response.status){
        res.status(200).json(response.result);
    }else{
        res.status(400).json(response.result);
    }
})

router.post("/token", async (req,res) => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        res.status(403).json({"message": "Refresh token is missing"});
    }
    try {
        let payload  = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let newPayload = {email: payload.email,username: payload.username};
        let token = jwt.sign(newPayload, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRY});
        res.status(200).json({token});
    }catch(e){
        console.log("error while getting token", e.message);
        res.status(403).json({"message": "Invalid Token"});
    } 
    

})









module.exports = router