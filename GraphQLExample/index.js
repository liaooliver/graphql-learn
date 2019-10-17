const { ApolloServer } = require('apollo-server');

var users = ["KV","Apple"]
var todolists = [{
    id: 1,
    owner: "KV",
    item: "我是 KV 的 Item1",
    updated: new Date(),
    created: new Date(),
    remark: "",
    isFinished: false
}, {
    id: 2,
    owner: "Apple",
    item: "我是 Apple 的 Item1",
    updated: new Date(),
    created: new Date(),
    remark: "",
    isFinished: false
}, {
    id: 3,
    owner: "KV",
        item: "我是 KV 的 Item2",
    updated: new Date(),
    created: new Date(),
    remark: "",
    isFinished: false
}]

const typeDefs = `
    type Query {
        totalItems: Int!
        totalLists(date: String): [Lists!]!
        owner:Owner
    }

    type Mutation{
        addItem(item:String! remark:String):Lists!
        deleteItem(id: ID!): [Lists!]!
        updateItem(id: ID! item:String! remark:String):Lists!
    }

    type Lists{
        id: ID!
        owner: String!
        item: String!
        updated: String!
        created: String!
        remark: String
        isFinished: Boolean!
    }

    type Owner{
        name: String!
        jobs: [Lists]
    }
`

const resolvers = {
    Query: {
        owner: (parent) => {
            console.log("parent", parent)
            return { name: users[0] }
        },
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
    Owner: {
        jobs: (parent, args) => {
            console.log(parent)
            return todolists.filter(todo => todo.owner == parent.name);
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => console.log(`GraphQL service Running on ${url}`))