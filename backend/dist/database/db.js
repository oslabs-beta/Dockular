import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
// Create a PostgreSQL connection pool
const config = {
    "host": process.env.POSTGRES_HOST_NAME,
    "port": Number(process.env.POSTGRES_PORT),
    "user": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
};
const pool = new pg.Pool(config);
export default pool;
