const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

// resolvers 資料取得的實做
const resolvers = {
    // 查詢資料
    Query:{
        info: () =>　`this is API of a Hackernews Clone`,
        // GraphQLServer 上附加 prisma 才能調用 prisma  
        feed: (root, args, context, info) => {
            // 調用 context prisma links 方法 返回資料
            return context.prisma.links()
        }
    },
    // 資料變動
    Mutation:{
        // 新增
        post: (root, args, context) =>{
            // 調用 context prisma createLink 方法 新增並返回資料
            return context.prisma.createLink({
                url: args.url,
                description: args.description
            })
        },
        // 修改
        updateLink: (parent, args) => {
            let pos = links.map( link => link.id).indexOf(args.id);
            links.forEach(link => {
                if(link.id == args.id){
                    link.description = args.description;
                    link.url = args.url;
                }
            })
            return links[pos]
        },
        // 刪除
        deleteLink: (parent, args) => {
            links = links.filter((link) => {
                if(link.id !== args.id){
                    return link
                }
            })
            return links
        }
    }
}

const server = new GraphQLServer({
    // schema 定義 api
    typeDefs:'./src/schema.graphql',
    resolvers,
    // prisma 附加到 context
    context: { prisma }
})

server.start(() => console.log(`server is running in localhost 4000`));