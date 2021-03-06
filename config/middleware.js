// import requirements
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
// Middleware
module.exports = server => {
    server.use(morgan("short")); 
    server.use(helmet()); 
    server.use(express.json());
    server.use(cors());
};
