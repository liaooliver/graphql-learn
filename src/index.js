const { GraphQLServer } = require('graphql-yoga');

// 儲存資料
let links = [{
    id:'link-0',
    url:'www.howtographql.com',
    description:'Fullstack tutorial for GraphQL'
}]

let idCount = links.length;

// resolvers 資料取得的實做
const resolvers = {
    // 查詢資料
    Query:{
        info: () =>　`this is API of a Hackernews Clone`,
        // 讀取數據 資料
        feed: () =>　links
    },
    // 資料變動
    Mutation:{
        // 新增
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link);
            return link;
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
    resolvers
})

server.start(() => console.log(`server is running in localhost 4000`));