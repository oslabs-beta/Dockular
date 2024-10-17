const fs = require('fs');
const http = require('http'); 
const process = require('process');
const express = require('express');
const app = express(); 

// Get //hello endpoint
app.get('/hello', function(req, res){
    res.send({message:'hello'})
});

//start the server
const sock = process.argv[2];

if (!sock) {
  console.error('Please provide a socket path as an argument.');
  process.exit(1);
}

fs.stat(sock, function(err){
    if(!err){
        fs.unlinkSync(sock)
    }


  const server = http.createServer(app);
    
    server.listen(sock, function() {
        fs.chmodSync(sock, '777'); // Change permissions
        console.log('Express server listening on ' + sock);
    });
})

 