"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const process_1 = __importDefault(require("process"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const app = (0, express_1.default)();
//start the server
//  const sock = process.argv[2] ;
const sock = '/run/guest-services/backend.sock';
if (!sock) {
    console.error('Please provide a socket path as an argument.');
    process_1.default.exit(1);
}
fs_1.default.stat(sock, function (err) {
    if (!err) {
        fs_1.default.unlinkSync(sock);
    }
    const server = http_1.default.createServer(app);
    // USE LOCAL HOST INSTEAD OF CLOUD ATLAS
    const URI = 'mongodb://host.docker.internal:27017';
    mongoose_1.default
        .connect(URI, {
        dbName: 'dockular'
    })
        .then(() => console.log("Connected to Mongo DB."))
        .catch((err) => console.log(err));
    // mongoose.connect(
    //   // Mongo URI:
    //   "mongodb+srv://Dockular123:root123@cluster0.iy4tj.mongodb.net/"
    // //   process.env.MONGOURI
    // )
    // .then(()=>{console.log(`MongoDB Connected: ${conn.connection.host}`)})
    // .catch((error)=>{
    // console.error(`Error ${error.message}`);
    // process.exit(1);
    // })
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Get //hello endpoint
    app.get('/hello', function (req, res) {
        res.send({ message: 'hello' });
    });
    //Routes
    app.use('/api/user/', userRouter_1.default);
    // Catch-All Error Handler
    app.use('/', (req, res) => {
        return res
            .status(404)
            .json({ error: 'Endpoint does not exist' });
    });
    // Global Error Handler
    app.use((err, req, res, next) => {
        const defaultErr = {
            log: { err: 'Express error handler caught unknown middleware error' },
            status: 500,
            message: 'internal server error: HELLLO',
        };
        const errorObj = Object.assign({}, defaultErr, err);
        console.log(errorObj.log);
        return res.status(errorObj.status).json(errorObj.message);
    });
    server.listen(sock, function () {
        // fs.chmodSync(sock, '777'); // Change permissions
        console.log('Express server listening on ' + sock);
    });
});
