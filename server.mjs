import 'dotenv/config' ;
import express from 'express'; // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import logger from './modules/logging.mjs';
import errorHandler from './modules/errorHandler.mjs';


// Creating an instance of the server
const server = express();

// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging
//const logg = new logger();
//server.use(logger.createAutoHTTPRequestLogger()); 
server.use(express.static('public'));



// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

server.get("/", (req, res, next) => {

   req.originalUrl

   res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
   //next(new Error('This is a deliberate error for testing purposes'));
});
//Enable error Handler
server.use(errorHandler);


// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});


