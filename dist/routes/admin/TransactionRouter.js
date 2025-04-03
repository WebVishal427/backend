"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionController_1 = require("../../controllers/Admin/TransactionController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class TransactionRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.delete();
    }
    get() {
        this.router.get("/lists", Authnetication_1.default.admin, TransactionController_1.TransactionController.listTransaction);
    }
    delete() {
        this.router.delete("/:id", Authnetication_1.default.admin, TransactionController_1.TransactionController.deleteTransaction);
    }
}
exports.default = new TransactionRoute().router;
