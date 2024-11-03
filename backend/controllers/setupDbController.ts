import pool from '../database/db.js';

const controllerDbSetup:any = {};

controllerDbSetup.setup = async (req:any, res:any, next:any) => {
  const client = await pool.connect();
  try {  
      await client.query(`CREATE TABLE IF NOT EXISTS public.user_info (
            pk_user_id BIGSERIAL NOT NULL PRIMARY KEY,
            user_name VARCHAR(55) NOT NULL,
            password VARCHAR(255) NOT NULL
        );`);
      return next();
  } catch (err) {
      console.log(err);
      return next(`ERROR within controllerDbSetup: ${err}`)
  } finally {
      client.release(); 
  }
};

 
export default controllerDbSetup;

