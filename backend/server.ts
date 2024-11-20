import fs from 'fs';
import http from 'http'; 
import process from 'process';
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import pool from './database/db.js';
import axios from 'axios';
 

//ROUTES
import setupDbRouter from './routes/setupPostgresDbRouter.js'; 
import userRouter from './routes/userRouter.js'

import * as dotenv from 'dotenv';
dotenv.config();

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
const URI:any = process.env.MONGO_HOST;

mongoose
  .connect(
    URI,
    {
      dbName: process.env.MONGO_DB_NAME
    }
  )
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));


/////////////////////////////////////////////////////////////////////////////////////

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 // TEST SOCKETS BACKEND: /////////////////////////////////////////////////////////////////////////////
 app.get('/hello', function(req, res){
  res.send({message:'Hello World'})
});


app.get('/postgresTest', async function(req, res){
  const client = await pool.connect();
  try {  
      await client.query(`CREATE TABLE IF NOT EXISTS public.user_info (
            pk_user_id BIGSERIAL NOT NULL PRIMARY KEY,
            user_name VARCHAR(55) NOT NULL,
            password VARCHAR(255) NOT NULL
        );`);
       res.status(200).send({message:'Connected to DB and created Table'})
  } catch (err) {
    console.log(err);
    res.sendStatus(500)
  } finally {
    client.release(); 
  }
});

app.get("/get-user", async (req: Request, res: Response) => {
  axios.get(process.env.API_URL_USERS_GET_REQUEST || "")
    .then((response:any) => {
      const result = response.data.body
      res.status(200).send(result)
     })
      .catch(error => {
      // Handle errors
     console.log(`Error in axios GET request: ${error}`)
  });

 })

 //  app.post("/api/create-user", async (req: Request, res: Response) => {

//   try{
//     const {
//       username,
//       cognitoId
//     } = req.body;

//   } catch (err:any) {
//     res.status(500).json({message: `Error retrieving users: ${err.message}` })
//   }
//  })

/////////////////////////////////////////////////////////////////////////////////////////////////////////

 //Routes
 app.use('/api/setupDB', setupDbRouter);
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



