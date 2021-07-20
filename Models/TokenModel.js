const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({ 
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
    token: { 
        type: String,
        required: true,
    }
},{timeStamp: true});

const TokenModel = new mongoose.model("refreshTokens", tokenSchema);

module.exports = TokenModel;