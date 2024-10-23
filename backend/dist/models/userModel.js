"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    event_id: {
        type: Array
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema);
// module.exports = User;
exports.default = User;
