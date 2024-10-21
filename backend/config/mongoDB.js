const mongoose = require('mongoose')
require('dotenv').config();

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
      // Mongo URI:
      "mongodb+srv://Dockular123:root123@cluster0.iy4tj.mongodb.net/"
    //   process.env.MONGOURI
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectMongoDB;

