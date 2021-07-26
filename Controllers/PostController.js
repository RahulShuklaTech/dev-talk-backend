const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel");



const createPost = async ({ owner, content }) => {
    try {
        console.log("createPost", owner, content);
        const post = new PostModel({ owner, content });
        let newPost = await post.save();


        console.log("new post", newPost);
        // let user = await User.findOne({_id:owner});
        let task = await UserModel.updateOne({ _id: owner }, { $push: { posts: newPost._id } });
        // user.posts.push(post._id);
        //  await task.save();

        let response = await PostModel.findOne({ _id: newPost._id }).populate("owner");
        return { status: true, result: { message: response } }
    } catch (e) {
        console.log("createPost", e.message);
        return { status: false, result: { message: e.message } }
    }
}




const likePost = async (post, user) => {
    try {
        let postFound = await PostModel.findOne({ _id: post });
        console.log("found Post", postFound.likes)
        if (postFound.likes.indexOf(user) == -1) {
            // await postFound.likes.push(user);
            const edittedPost = await PostModel.updateOne({ _id: post }, { $push: { likes: user } });
            const personWhoLiked = await UserModel.updateOne({ _id: user }, { $push: { likedPosts: post } })
            console.log("--------------------",postFound)
            return { status: true, result: { liked: true, message: postFound } }

        } else {
            const edittedPost = await PostModel.updateOne({ _id: post }, { $pull: { likes: user } });
            const personWhoDisliked = await UserModel.updateOne({ _id: user }, { $pull: { likedPosts: post } });
            console.log("--------------------",postFound)
            return { status: true, result: { liked: false, message: postFound } }
        }
        

    } catch (e) {
        console.log("unlikepost", e.message)
        return { status: false, result: { message: e.message } }

    }
}


const postDetails = async (postId) => {
    try {
        console.log("post", postId);
        let post = await PostModel.findOne({ _id: postId }).populate("owner").populate("likes");
        console.log("post details", post);
        return { status: true, result: { message: post } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }
}



const deletePost = async (postId, user) => {
    try {
        let foundPost = await PostModel.findOneAndDelete({ _id: postId });
        let user = foundPost.owner;
        let task = await UserModel.updateOne({ _id: user }, { $pull: { posts: postId } });
        console.log("post", foundPost);
        return { status: true, result: { message: "Post deleted successfully" } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }
}


const getAllPosts = async (username) => {

    try {
        let usersPosts = await UserModel.findOne({ username }).populate({
            path: "posts",
            populate:["owner"],
        });
        let userID = usersPosts._id.toString();
        let userFriends = usersPosts.following.filter(item => item !=userID);
        let friendsPosts = [];
       
        for (let friend of userFriends) {
                let friendPost = await getFriendsPosts(friend);
                if (friendPost.status) {
                    friendsPosts.push(...friendPost.result.message);
                }
        }
        let allPosts = friendsPosts.concat(usersPosts.posts)
        return { status: true, result: { message: allPosts } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }
}

const getFriendsPosts = async (id) => {
    try {
        let friendsPosts = await UserModel.findOne({ _id: id }).populate({
            path: "posts",
            populate: {
                path: "owner",
            }
        });

        return { status: true, result: { message: friendsPosts.posts } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }

}


module.exports = { createPost, likePost, postDetails, deletePost, getAllPosts }