const fs = require('fs');
const http = require('http'); 
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')

const app = express(); 
 
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

 // USE LOCAL HOST INSTEAD OF CLOUD ATLAS
const URI = 'mongodb://host.docker.internal:27017'

mongoose
  .connect(
    URI,
    {
      dbName: 'dockular'
    }
  )
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));


  // mongoose.connect(
  //   // Mongo URI:
  //   "mongodb+srv://Dockular123:root123@cluster0.iy4tj.mongodb.net/"
  // //   process.env.MONGOURI
  // )
  // .then(()=>{console.log(`MongoDB Connected: ${conn.connection.host}`)})
  // .catch((error)=>{
  // console.error(`Error ${error.message}`);
  // process.exit(1);
  // })


 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 // Get //hello endpoint
 app.get('/hello', function(req, res){
   res.send({message:'hello'})
 });

 //Routes
 app.use('/api/user/', userRouter);
 
  // Catch-All Error Handler
  app.use('/', (req, res ) => {
    return res
     .status(404)
     .json({ error: 'Endpoint does not exist' });
  });

  // Global Error Handler
  app.use(
    (err, req, res, next) => {
      const defaultErr = {
        log: {err:'Express error handler caught unknown middleware error'},
        status: 500,
        message: 'internal server error: HELLLO',
    };

      const errorObj = Object.assign({}, defaultErr, err);
      console.log(errorObj.log);
      return res.status(errorObj.status).json(errorObj.message);
    })

    server.listen(sock, function() {
        fs.chmodSync(sock, '777'); // Change permissions
        console.log('Express server listening on ' + sock);
    });
})

 