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

 

  // const express = require('express');
  // const app = express();
  // const PORT = 3000;

  // // Get //hello endpoint
  // app.get('/hello', function(req, res){
  //   res.send({message:'hello'})
  // });

  // // catch-all route handler for any requests to an unknown route
  // app.use((req, res) => {
  //   res.status(404).send('error with server')
  // });

  // //Global Error Handler
  // const globalErrorHandler = (err, req, res, next) => {
  //     const defaultErr = {
  //       log: 'Express error handler caught unknown middleware error',
  //       status: 500,
  //       message: { err: 'An error occurred' }, 
  //     };

  //     const errorObj = Object.assign(defaultErr, err);
  //     const errorStatus = err.status || errorObj.status;

  //     return res.status(errorStatus).json(errorObj.message);
  // }

  // app.use(globalErrorHandler); 

  
  // //start server
  // app.listen(PORT, () => {
  //   console.log(`Server listening on port: ${PORT}`);
  // });

  // module.exports = app;

