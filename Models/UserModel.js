const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }],
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }]

},{timeStamp: true});

const UserModel = new mongoose.model('user', userSchema);

module.exports = UserModel;