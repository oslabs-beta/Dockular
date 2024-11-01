import { Pool } from 'pg';
// Create a PostgreSQL connection pool
const pool = new Pool({
    "host": 'rds-dockulardb-instance.c7we222muguf.us-east-1.rds.amazonaws.com',
    "port": 5432,
    "user": "DockularPGSDB",
    "password": "drivingKite1209",
    "database": "DockularDB",
});
export default pool;
//   import pg from 'pg';
// // Create a PostgreSQL connection pool
// const config: pg.PoolConfig = {
//     "host": 'rds-dockulardb-instance.c7we222muguf.us-east-1.rds.amazonaws.com',
//     "port": 5432,
//     "user": "DockularPGSDB",
//     "password": "drivingKite1209",
//     "database": "DockularDB",
//   };
//   const pool = new pg.Pool(config)
//   export default pool; 
