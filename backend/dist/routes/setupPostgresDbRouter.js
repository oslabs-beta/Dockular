import express from 'express';
import controllerDbSetup from '../controllers/setupDbController.js';
const setupDbRouter = express.Router();
setupDbRouter.get('/tableSetup', controllerDbSetup.setup, (req, res) => {
    res.status(200).json({ message: 'DB Table Created' });
});
export default setupDbRouter;
