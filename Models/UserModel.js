const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true
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
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post'
    },
    followers: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }

},{timeStamp: true});

const UserModel = new mongoose.model('User', userSchema);

module.exports = UserModel;