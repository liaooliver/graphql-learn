// context 會從 index.js GraphQLServer -> context 取得傳入的資料
function feed(root, args, context, info){
    // 調用 context prisma links 方法 返回資料
    return context.prisma.links()
}

module.exports = {
    feed
}