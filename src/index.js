const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');

// resolvers 資料取得的實做
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link
}

const server = new GraphQLServer({
    // schema 定義 api
    typeDefs:'./src/schema.graphql',
    resolvers,
    // prisma 附加到 context
    context: request => {
        return {
            ...request,
            prisma
        }
    }
})

server.start(() => console.log(`server is running in localhost 4000`));