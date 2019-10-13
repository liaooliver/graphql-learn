const { ApolloServer } = require('apollo-server');

var todolists = [
    {   
        id:1,
        item:'learn GraphQL',
        created:'2019/10/01',
        remark:'so easy',
        isFinished:false
    }
]

const typeDefs = `
    type Query {
        totalItems: Int!
        totalLists: [Lists!]!
    }

    type Mutation{
        addItem(item:String! remark:String):Lists!
    }

    type Lists{
        id: ID!
        item: String!
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
                id: todolists.length+1,
                item: args.item,
                created: new Date().toLocaleDateString(),
                remark: args.remark ? args.remark :  "",
                isFinished: false
            }
            todolists = [...todolists, newItem]
            console.log(todolists)
            return newItem
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => console.log(`GraphQL service Running on ${url}`))
