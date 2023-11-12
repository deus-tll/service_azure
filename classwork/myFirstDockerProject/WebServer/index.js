const http = require("http");

const SERVER_NAME = process.env.SERVER_NAME || "I have not name"

http.createServer(function(request, response){

    response.end("<h1>Hello world from container: " + SERVER_NAME + "</h1>");
}).listen(80);