import express from 'express';
import controllerDbSetup from '../controllers/setupDbController.js'; 

const setupDbRouter:any = express.Router();


setupDbRouter.get('/tableSetup', controllerDbSetup.setup, (req:any, res:any) => {
  res.status(200).json({message: 'DB Table Created'});
});


export default setupDbRouter;