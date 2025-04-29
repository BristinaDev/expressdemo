import express from "express"
import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import listEndpoints from 'express-list-endpoints';
import userRoutes from './routes/userRoutes.js';
import { graphqlHTTP } from "express-graphql";
import User from './models/users.model.js';

import {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList
} from 'graphql';

const app = express()
dotenv.config();

app.use(express.json());
app.use('/users', userRoutes);

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {type: GraphQLID},
		fullname: {type: GraphQLString},
		username: {type: GraphQLString},
		email: {type: GraphQLString}
	}
})
// GraphQL schema
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
		users: {
      type: new GraphQLList(UserType),
      resolve: () => User.find()
    }
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.get('/', (req, res) => {
	res.send(`
			<html>
					<head>
							<title>Hospital Management System</title>
							<style>
									body {
											font-family: Arial, sans-serif;
											background-color: #f4f4f4;
											margin: 0;
											padding: 0;
											display: flex;
											justify-content: center;
											align-items: center;
											height: 100vh;
									}
									.container {
											text-align: center;
											background: white;
											padding: 20px;
											border-radius: 8px;
											box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
									}
									h1 {
											color: #333;
									}
									p {
											color: #666;
									}
							</style>
					</head>
					<body>
							<div class="container">
									<h1>Welcome DEMO!!</h1>
									<p>The backend server is running!</p>
							</div>
					</body>
			</html>
	`);
});

console.log(listEndpoints(app));

connectionDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

