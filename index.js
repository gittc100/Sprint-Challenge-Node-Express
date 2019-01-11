// reference location
const server = require('./api/server');
// initialize server location 5000
const port = process.env.PORT || 5000;
server.listen(port, ()=>{
    console.log('server running');
});