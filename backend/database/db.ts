import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

// Create a PostgreSQL connection pool - AWS RDS
// const config: pg.PoolConfig = {
//   "host": process.env.AWS_RDS_ENDPOINT,
//   "port": Number(process.env.AWS_RDS_PORT),
//   "user": process.env.AWS_RDS_USER,
//   "password": process.env.AWS_RDS_PASSWORD,
//   "database": process.env.AWS_RDS_DATABASE,
// };

// // Create a PostgreSQL connection pool
const config: pg.PoolConfig = {
    "host": process.env.POSTGRES_HOST_NAME,
    "port": Number(process.env.POSTGRES_PORT),
    "user": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
  };

  const pool = new pg.Pool(config)
  
  export default pool; 