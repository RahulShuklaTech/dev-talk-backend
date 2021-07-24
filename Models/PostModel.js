const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    owner: { 
        type: mongoose.SchemaTypes.ObjectId,
        unique: true,
        ref: 'user'
    },

    likes: [{ 
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    }],

    dislikes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    }],

    content: {
        type: String,
        required: true
    }


}, {timestamps :true});


const postModel = new mongoose.model('posts', postSchema);

module.exports = postModel