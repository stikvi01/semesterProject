import 'dotenv/config' ;
import express from 'express'; 
import USER_API from './routes/usersRoute.mjs'; 
import RECIPE_API from './routes/RecipieRoute.mjs';
import logger from './modules/logging.mjs';
import errorHandler from './modules/errorHandler.mjs';

const server = express();

const port = (process.env.PORT || 8080);
server.set('port', port);

const logg = new logger();
server.use(logg.createAutoHTTPRequestLogger()); 
server.use(express.static('public'));

server.use("/user", USER_API); 

server.use("/recipie", RECIPE_API)


server.get("/", (req, res, next) => {

   req.originalUrl

   res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();

});

server.use(errorHandler);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});


