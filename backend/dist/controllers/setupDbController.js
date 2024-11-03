var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../database/db.js';
const controllerDbSetup = {};
controllerDbSetup.setup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        yield client.query(`CREATE TABLE IF NOT EXISTS public.user_info (
            pk_user_id BIGSERIAL NOT NULL PRIMARY KEY,
            user_name VARCHAR(55) NOT NULL,
            password VARCHAR(255) NOT NULL
        );`);
        return next();
    }
    catch (err) {
        console.log(err);
        return next(`ERROR within controllerDbSetup: ${err}`);
    }
    finally {
        client.release();
    }
});
export default controllerDbSetup;
