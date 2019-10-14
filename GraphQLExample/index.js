const { ApolloServer } = require('apollo-server');

var todolists = []

const typeDefs = `
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
    Query:{
        totalItems: () => todolists.length,
        totalLists: (parent, args) => {
            console.log('args',args)
            return args.date ? todolists.filter(list => list.created === args.date) : todolists;
        }
    },
    Mutation:{
        addItem: (parent, args) => {
            console.log('args', args)
            let newItem = {
                id: new Date().getTime(),
                item: args.item,
                updated: new Date().toLocaleString(),
                created: new Date().toLocaleString(),
                remark: args.remark ? args.remark :  "",
                isFinished: false
            }
            todolists = [...todolists, newItem]
            console.log(todolists)
            return newItem
        },
        deleteItem: (parent, args) => {
            let index = todolists.map((list)=> list.id).indexOf(parseInt(args.id));
            console.log(index)
            todolists.splice(index, 1);
            return todolists
        },
        updateItem: (parent, args) => {
            let index = todolists.map((list) => list.id).indexOf(parseInt(args.id));
            todolists.forEach(list => {
                if(list.id == args.id){
                    list.item = args.item;
                    list.remark = args.remark ? args.remark : "";
                    list.updated = new Date().toLocaleString();
                }
            })
            console.log(todolists[index])
            return todolists[index]
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => console.log(`GraphQL service Running on ${url}`))
