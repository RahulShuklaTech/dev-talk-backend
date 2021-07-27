const UserModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');

const defaultPic = "/images/avatar.png";
const signUp = async ({ name,username, email, password, avatar,filename }) => {

    if(!avatar){
        avatar = defaultPic;
    }
    

    let emailRegex = /.*@*\../;
    if (!emailRegex.test(email)) {
        return { status: false, result: { message: { email: 'Please enter a valid email address' } } };
    }
    if (username.length < 5) {
        return { status: false, result: { message: { username: 'Username must be at least 5 characters' } } };
    }
    if (password.length < 5) {
        return { status: false, result: { message: { password: 'Password must be at least 5 characters' } } };
    }
    console.log(username)
    let hash = await bcrypt.hash(password, 10);

    try {
        let user = new UserModel({ name ,username, email, password: hash, avatar,filename });
        let savedUser = await user.save();
        console.log(".....................",savedUser);
        return { status: true, result: { message: savedUser } };
    } catch (e) {
        console.log("error", e.message)
        return { status: false, result: { message: e } };
    }
}


const loginUser = async ({ username, password }) => {
    try {
        let user = await UserModel.findOne({ username });
        if (!user) {
            return { status: false, result: { message: 'User not found', code: "username" } };
        }
        let result = await bcrypt.compare(password, user.password);
        if (!result) {
            return { status: false, result: { message: 'Wrong password', code: "password" } };
        }
        return { status: true, result: { message: user } };
    } catch (e) {
        console.log(e.message);
        return { status: false, result: { message: e } };
    }

}

const findUser = async (username) => {
    try {
        let user = await UserModel.findOne({ username }).populate({
            
            path: "posts",
            populate: {
                path: "owner",
            },
            
           
        });
        return { status: true, result: { message: user } };
    } catch (e) {
        console.log(e.message);
        return { status: false, result: { message: e } };
    }
}


//follow users and Unfollow users


const followUser = async (personToFollow, personFollowing) => {
    console.log(personToFollow, personFollowing);
    try {
        let following = await UserModel.findOne({ username: personFollowing });
        let followed = await UserModel.findOne({ username: personToFollow });
        if (!following || !followed) {
            return { status: false, result: { message: 'User not found' } };
        }
        console.log();

        if (following.following.indexOf(followed._id) === -1) {

            let addToFollowerList = await UserModel.updateOne({ _id: followed._id }, { $push: { followers: following._id } });
            let addToFollowingList = await UserModel.updateOne({ _id: following._id }, { $push: { following: followed._id } });
            return { status: true, result: { message: addToFollowerList, message2: addToFollowingList, message3:true } };

        }else {
            console.log("already following");
            let removeFromFollowerList = await UserModel.updateOne({ _id: followed._id }, { $pull: { followers:  following._id } });
            let removeFromFollowingList = await UserModel.updateOne({ _id: following._id }, { $pull: { following: followed._id } });
            return { status: true, result: { message: removeFromFollowerList, message2: removeFromFollowingList, message3:false } };
        }

    } catch (e) {
        console.log(e.message);
        return { status: false, result: { message: e.message } };
    }
}



const getFollowerSuggestions = async (username) => { 

    try {
        let currentUser = await UserModel.findOne({ username });
        const allUsers = await UserModel.find({ username: { $ne: username } });
        // console.log("allusers: ",allUsers);
        const potentialFollowers = allUsers.filter(user => !user.followers.includes(currentUser._id));   
        
        return { status: true, result: { message: potentialFollowers.slice(0,5) } };

    }catch(e) {
        console.log(e.message);
        return { status: false, result: { message: e.message } };   
    }
}







module.exports = { signUp, loginUser, findUser,followUser,getFollowerSuggestions }