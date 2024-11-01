import fs from 'fs';
import http from 'http'; 
import process from 'process';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js'
// import { Pool } from 'pg';

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


////////////////////////////////////////////////////////////////////////////////////
//PostgresSql backend

// Create a PostgreSQL connection pool
// const pool = new Pool({
//   "host": 'mahmud.db.elephantsql.com ',
//   "port": 5432,
//   "database": "zpwhipig",
//   "user": "zpwhipig",
//   "password": "nCEImo1UXY4rRo8oqzBAbb_knG477_Zi",
// });

// async function main(){
//   const client = await pool.connect();
//   try {
//    const response = await client.query(`CREATE TABLE IF NOT EXISTS public.user_info (
//     pk_user_id BIGSERIAL NOT NULL PRIMARY KEY,
//     user_name VARCHAR(55) NOT NULL,
//     password VARCHAR(255) NOT NULL
// );`);
//    const {rows}:any = response; 
//    console.log(rows)
//   } catch (err) {
//     console.error('Error creating the users table', err);
//   } finally {
//     client.release();
//   }
// }

// main()
// .then(()=>{console.log('connected to postgres')})
// .catch((err)=>{console.log(`Error connecting to postgres, ${err}`)});


// async function main(){
//   const client = await pool.connect();
//   try {
//    const response = await client.query(`SELECT * FROM user_info`);
//    const {rows}:any = response; 
//    console.log(rows)
//   } catch (err) {
//     console.error('Error creating the users table', err);
//   } finally {
//     client.release();
//   }
// }

// main()
// .then(()=>{console.log('connected to postgres')})
// .catch((err)=>{console.log(`Error connecting to postgres, ${err}`)});


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
  res.send({message:'Hello World'})
});

//  app.get('/hello', async function(req, res){
//   let message;

//     try {
//         const client = await pool.connect();
//         const response = await client.query(`SELECT * FROM user_info`);
//         message = response; // Get the rows from the response

//         // message = response.rows; // Get the rows from the response
//     } catch (err) {
//         message = err; 
//     }
    
//     res.send({ message: message });
//  });



//  app.get('/postgresTest', function(req, res) {
//   let message = 'hello';

//   // try {
//   //     const client = await pool.connect();
//   //     const response = await client.query(`SELECT * FROM user_info`);
//   //     message = response.rows; // Get the rows from the response
//   //     client.release(); // Release the client back to the pool
//   // } catch (err) {
//   //     message = err; 
//   // }
  
//   res.send({ message: message });
// });


 

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






//////////////////////////////////////////////////////////////


// import fs from 'fs'; 
// import http from 'http';
// import process from 'process';
// import express from 'express'; 
// const app = express(); 

// // Get //hello endpoint
// app.get('/hello', function(req, res){
//     res.send({message:'Goodbye'})
// });
// //start the server
// const sock = process.argv[2];

 
// fs.stat(sock, function(err){
//     if(!err){
//         fs.unlinkSync(sock)
//     }
//   const server = http.createServer(app);
    
//     server.listen(sock, function() {
//         fs.chmodSync(sock, '777'); // Change permissions
//         console.log('Express server listening on ' + sock);
//     });
// })