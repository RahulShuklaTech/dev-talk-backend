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

        let response = await post.save();
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
            await PostModel.updateOne({ _id: post }, { $push: { likes: user } });
            await UserModel.updateOne({ _id: user }, { $push: { likedPosts: post } })
            return { status: true, result: { message: "Post liked" } }

        } else {
            await PostModel.updateOne({ _id: post }, { $pull: { likes: user } });
            await UserModel.updateOne({ _id: user }, { $pull: { likedPosts: post } });
            return { status: true, result: { message: "Post disliked" } }
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
        // await UserModel.updateOne({ _id: user }, { $pull: { pos: post } });



        return { status: true, result: { message: "Post deleted successfully" } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }
}


const getAllPosts = async () => { }


// const findLikes = async (id) => { 
//     try {
//         let post = await Post.findOne({_id:id}).populate({ path: "likes",populate: {path: "dislikes"}});
//         let likes = await post.populate("likes");
//         let numbOfLikes = likes.length
//         return {status: true,result: {message: {likes,numberOflikes}}
//     }
// }

module.exports = { createPost, likePost, postDetails, deletePost }