"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = require("../../controllers/Admin/CustomerController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class CustomerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.put();
        this.delete();
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, CustomerController_1.CustomerController.add);
    }
    put() {
        this.router.put("/:customerId", Authnetication_1.default.admin, CustomerController_1.CustomerController.update);
        this.router.put("/status/:customerId", Authnetication_1.default.admin, CustomerController_1.CustomerController.updateStatus);
    }
    get() {
        this.router.get("/list", Authnetication_1.default.admin, CustomerController_1.CustomerController.list);
        this.router.get("/view/:customerId", Authnetication_1.default.admin, CustomerController_1.CustomerController.view);
    }
    delete() {
        this.router.delete("/delete", Authnetication_1.default.admin, CustomerController_1.CustomerController.delete);
    }
}
exports.default = new CustomerRouter().router;
