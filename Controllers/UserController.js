const UserModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');


const signUp = async ({username,email,password,avatar}) => {
   let emailRegex = /.*@*\../;
   if(!emailRegex.test(email)){
       return {status: false, result: {message: {email:'Please enter a valid email address'}}} ;
   }
   if(username.length < 5){
       return {status: false, result: {message: {username:'Username must be at least 5 characters'}}};
   }
   if(password.length < 5){
       return {status: false, result: {message: {password:'Password must be at least 5 characters'}}};
   }
   console.log(username)
   let hash = await bcrypt.hash(password, 10);

   try {
       let user =  new UserModel ({ username, email, password: hash, avatar });
       let savedUser = await user.save();
       return {status: true, result: {message: savedUser}};
   }catch(e){
       console.log("error",e.message)
       return {status: false, result: {message: e}};
   }
}


const loginUser = async ({username, password}) => {
    try{
        let user = await UserModel.findOne({username});
        if(!user){
            return {status: false, result: {message: 'User not found',code: "username"}};
        }
        let result = await bcrypt.compare(password, user.password);
        if(!result){
            return {status: false, result: {message: 'Wrong password',code: "password"}};
        }
        return {status: true, result: {message: user}};
    }catch(e){
        console.log(e.message);
        return {status: false, result: {message: e}};
    }

}

const findUser = async (username) => {  
    try{ 
        let user = await UserModel.findOne({username});
        return {status: true, result: {message: user}};
    }catch(e){
        console.log(e.message);
        return {status: false, result: {message: e}};
    }
}



module.exports = {signUp,loginUser,findUser}