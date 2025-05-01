import express from "express"
import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import multer from 'multer'
import listEndpoints from 'express-list-endpoints';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
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

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function(req, file, cb){
		const uniqueSuffix = Date.now() 
		cb(null, uniqueSuffix+file.originalname)
	}
})

const upload = multer({storage: storage})
const app = express()
dotenv.config();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes)

app.post('/api/file-upload', upload.single('file'), (req, res) => {
	try{
    res.status(200).json({success: "File Upload Sucessfulll..."});
	}catch(error){
    res.status(500).json({ error: error});
	};
});

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

