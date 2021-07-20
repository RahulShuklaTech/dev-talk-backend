const RefreshTokens = require('../Models/TokenModel')

const findRefreshToken = async (email) => {
    try {
        const token = await RefreshTokens.findOne({ email });
        return { status: true, result: { message: token } }
    } catch (e) {
        return { status: false, result: { message: e.message } }
    }
}

const addRefreshToken = async ({email, token, username}) => {
    console.log("email",email,token,username)
    let lookup = await findRefreshToken(email);
    try {
        if (lookup.status) {
            let data = await RefreshTokens.findOneAndUpdate({ email }, { token });
            if (data) {
                return { status: true, result: { message: data.token } }
            }


        }
    }catch (e) {
        return { status: false, result: { message: e.message } }
    }

    try{
        const refreshToken = new RefreshTokens({email,username,token});
        await refreshToken.save();
        return { status: true, result: { message: refreshToken.token } }

    }catch(e){
        return { status: false, result: { message: e.message } }
    }
}


const removeRefreshToken = async ({ username }) => { 
    try {
        const refreshToken = await RefreshTokens.findOne({ username });
        await refreshToken.remove();
        return { status: true, result: { message: refreshToken.token } }
    }catch(e) {
        return { status: false, result: { message: e.message } }
    }
}

module.exports = { addRefreshToken, removeRefreshToken, findRefreshToken }
