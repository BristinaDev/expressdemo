import express from "express"
import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import multer from 'multer'
import listEndpoints from 'express-list-endpoints';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { graphqlHTTP } from "express-graphql";
import User from './models/users.model.js';
import { createServer } from 'node:http';
import { Server } from "socket.io";

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

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	console.log("User connected:", socket.id);

	socket.on('chat message', (msg) => {
		console.log('Message received:::::', msg);
		io.emit('chat message', msg);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
	});
});

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
	<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket.IO Chat</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
      body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; }
      #messages > li:nth-child(odd) { background: #efefef; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const socket = io();

        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (input.value) {
            console.log('Sending message:->>>>', input.value);
            socket.emit('chat message', input.value);
            input.value = '';
          }
        });

        socket.on('chat message', (msg) => {
          console.log('Received message::::::::::::::::', msg);
          const item = document.createElement('li');
          item.textContent = msg;
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
    </script>
  </body>
</html>
	`);
});


console.log(listEndpoints(app));

connectionDB();

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

