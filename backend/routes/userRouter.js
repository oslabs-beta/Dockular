// import express from 'express';
// import controllerForUsers from '../controllers/userController';
// import User from '../models/userModel.js';
const express = require('express');
const controllerForUsers = require('../controllers/userController');

const router = express.Router();

// router.post('/', controllerForUsers.loginUser, (req, res) => {
//   res.status(200).json('Success!');
// });

router.post('/registerUser', controllerForUsers.registerUser, (req, res) => {
  res.status(200).json('New User Added to DB!');
});

// router.post('/authUser', controllerForUsers.authUser, (req, res) => {
//   res.status(200).json('User Authorized!');
// });


module.exports = router;