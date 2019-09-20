const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function post(root, args, context){
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy:{ connect: { id: userId } }
    })
    // 調用 context prisma createLink 方法 新增並返回資料
}

async function signup(parent, args, context, info){
    // args 外部回傳的資料

    // 密碼加密
    const password = await bcrypt.hash(args.password, 10);

    // store new USER 
    const user = await context.prisma.createUser({...args, password})
    console.log(user)
    // 產生 token
    const token = jwt.sign({userId: user.id}, APP_SECRET)

    // return authpayload
    return {
        token,
        user
    }
}

async function login(parent, args, context, info){
    const user = await context.prisma.user({email: args.email})
    if(!user){
        throw new Error("No such user found")
    }

    const vaild = await bcrypt.compare(args.password, user.password)
    if(!vaild){
        throw new Error("Invaild password")
    }

    const token = jwt.sign({userId: user.id}, APP_SECRET)

    return {
        token,
        user
    }
}

module.exports = {
    signup,
    login,
    post
}