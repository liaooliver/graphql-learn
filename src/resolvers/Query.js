// context 會從 index.js GraphQLServer -> context 取得傳入的資料
async function feed(root, args, context, info){
    console.log(args)
    const where = args.filter ? {
        OR:[
            // 取得篩選字串
            { description_contains: args.filter },
            { url_contains: args.filter },
        ]} : {};
    
    // 給資料庫條件 
    const links = await context.prisma.links({ 
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
    })
    // 調用 context prisma links 方法 返回資料
    return links
}

module.exports = {
    feed
}