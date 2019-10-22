const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql')

var todolists = [
    {
        id: 1,
        item: "String!",
        updated: "String!",
        created: "2019-10-10",
        remark: "String",
        isFinished: false
    }
]

const typeDefs = `
    scalar DateTime

    type Query {
        totalItems: Int!
        totalLists(date: DateTime): [Lists!]!
    }

    type Mutation{
        addItem(item:String! remark:String):Lists!
        deleteItem(id: ID!): [Lists!]!
        updateItem(id: ID! item:String! remark:String):Lists!
    }

    type Lists{
        id: ID!
        item: String!
        updated: DateTime!
        created: DateTime!
        remark: String
        isFinished: Boolean!
    }
`

const resolvers = {
    Query: {
        totalItems: () => todolists.length,
        totalLists: (parent, args) => {
            console.log("args", args)
            return args.date ? todolists.filter(list => list.created === args.date) : todolists;
        }
    },
    Mutation: {
        addItem: (parent, args, context) => {
            let newItem = {
                id: new Date().getTime(),
                item: args.item,
                updated: new Date().toLocaleString(),
                created: new Date().toLocaleString(),
                remark: args.remark ? args.remark : "",
                isFinished: false
            }
            todolists = [...todolists, newItem]
            return newItem
        },
        deleteItem: (parent, args) => {
            let index = todolists.map((list) => list.id).indexOf(parseInt(args.id));
            todolists.splice(index, 1);
            return todolists
        },
        updateItem: (parent, args) => {
            let index = todolists.map((list) => list.id).indexOf(parseInt(args.id));
            todolists[index].item = args.item;
            todolists[index].remark = args.remark ? args.remark : "";
            todolists[index].updated = new Date().toLocaleString();
            return todolists[index]
        }
    },
    // 使用 GraphQLScalarType 物件建立自訂純量的解析函式
    DateTime: new GraphQLScalarType({
        // 自訂純量型態的名稱
        name: 'DateTime',
        // 自訂型態的描述
        description: 'A valid date time value.',
        // 把欄位 (server端) 查詢到的資料，回傳到 serialize 函式上，轉換成預期的格式，並輸出到 client端
        serialize: value => {
            console.log("serialize", value)
            return new Date(value).getTime()
        },
        // 把查詢變數(client端)上的資料，回傳到 parseValue 函式上，轉換成預期的格式，並輸入到 server 端
        parseValue: value =>  new Date(value).getTime(),
        // 把查詢引數(client端)上的資料，回傳到 serialize 函式上，轉換成預期的格式，並輸入到 server 端
        parseLiteral: ast => {
            console.log("ast", ast)
            // 判斷輸入的日期是 String or Int
            if (ast.kind === 'IntValue'){
                ast.value = parseInt(ast.value)
            }
            return new Date(ast.value).toLocaleDateString()
        }
    })
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => console.log(`GraphQL service Running on ${url}`))