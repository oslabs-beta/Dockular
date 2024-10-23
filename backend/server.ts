import fs from 'fs';
import http from 'http'; 
import process from 'process';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter'

const app = express(); 
 
 //start the server
 const sock =  process.argv[2] || '/run/guest-services/backend.sock'

 if (!sock) {
   console.error('Please provide a socket path as an argument.');
   process.exit(1);
 }

 fs.stat(sock, function(err){
     if(!err){
     fs.unlinkSync(sock)
 }

 const server = http.createServer(app);


/////////////////////////////////////////////////////////////////////////////////////

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


/////////////////////////////////////////////////////////////////////////////////////

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 // Get //hello endpoint
 app.get('/hello', function(req, res){
   res.send({message:'hello'})
 });

 //Routes
 app.use('/api/user/', userRouter);
 
  // Catch-All Error Handler
  app.use('/', (req:any, res:any ) => {
    return res
     .status(404)
     .json({ error: 'Endpoint does not exist' });
  });

  // Global Error Handler
  app.use(
    (err:any, req:any, res:any, next:any) => {
      const defaultErr = {
        log: {err:'Express error handler caught unknown middleware error'},
        status: 500,
        message: 'internal server error',
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

 