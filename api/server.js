// import requirements
const express = require("express");
const configureMiddleware = require('../config/middleware');
const projectsRouter = require('../projects/projectsRouter');
const actionsRouter = require('../actions/actionsRouter');
// create server instance
const server = express();
// Middleware
configureMiddleware(server);
//Routing
server.use('/api/projects', projectsRouter);
server.use('/api/projects', actionsRouter);
// export server for index.js use
module.exports = server;
