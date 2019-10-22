const { ApolloServer } = require('apollo-server');

var todolists = []

const typeDefs = `
    scalar DateTime

    type Query {
        totalItems: Int!
        totalLists(date: String): [Lists!]!
    }

    type Mutation{
        addItem(item:String! remark:String):Lists!
        deleteItem(id: ID!): [Lists!]!
        updateItem(id: ID! item:String! remark:String):Lists!
    }

    type Lists{
        id: ID!
        item: String!
        updated: String!
        created: String!
        remark: String
        isFinished: Boolean!
    }
`

const resolvers = {
    Query: {
        totalItems: () => todolists.length,
        totalLists: (parent, args) => {
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
        name: 'DateTime',
        description: 'A valid date time value.',
        // 把欄位查詢到的資料，回傳到 parseValue 函式上，轉換成預期的格式
        parseValue: value => new Date(value).toLocaleString(),
        // 把查詢變數上的資料，回傳到 serialize 函式上，轉換成預期的格式
        serialize: value => new Date(value).toLocaleString(),
        // 把
        parseLiteral: ast => new Date(value).toLocaleString()
    })
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => console.log(`GraphQL service Running on ${url}`))