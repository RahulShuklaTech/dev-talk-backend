require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {findUser,} = require('../Controllers/UserController');
const {createPost,deletePost,likePost,postDetails} = require('../Controllers/PostController');





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

router.post('/', validateRequest, async (req, res) => { 
    console.log(req.body)
    let {content} = req.body;
    try {
        let user = await findUser(req.username);
        console.log(user,"user")
        let payload = {owner: user.result.message._id, content};

        let post = await createPost(payload);
        post.status ?     
        res.status(200).json({message: post.result.message})
        :res.status(403).json({message: "Error while creating post"+post.result.message})

    }catch(e){
        console.log("error",e.message)
    }

})


router.post('/like',validateRequest,async (req, res) => {
    // console.log(req.body)
    let {postId} = req.body;
    try {
        let user = await findUser(req.username);
        // console.log(user,"user")
        // let payload = {owner: user.result.message._id, postId};

        let post = await likePost(postId,user.result.message._id);
        res.status(200).json({message: post.result.message})

    }catch(e){
        console.log("error",e.message)
        res.status(403).json({message: "Error while creating post"+e.message})
    }
})




router.get('/details',validateRequest,async (req, res) => {
    console.log("request body",req.body)
    let {postId} = req.body;
    try {
        // let user = await findUser(req.username);
        // console.log(user,"user")
        // // let payload = {owner: user.result.message._id, postId};

        let post = await postDetails(postId);
        res.status(200).json({message: post.result.message})

    }catch(e){
        console.log("error",e.message)
        res.status(403).json({message: "Error while getting details"+e.message})
    }
})


router.delete('/:postId',validateRequest,async (req, res) => { 
    let {postId} = req.params;
    try {
        let response  = await deletePost(postId);
        console.log(postId,"postId",response.result.message);
        res.status(200).json({message: response.result.message})
    }catch(e){
        console.log("error",e.message)
        res.status(403).json({message: response.result.message})
    }
})
  





module.exports = router