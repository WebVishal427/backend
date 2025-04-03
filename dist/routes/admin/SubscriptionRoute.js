"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubscriptionController_1 = require("../../controllers/Admin/SubscriptionController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class SubscriptionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.put();
    }
    get() {
        this.router.get("/viewPlans", Authnetication_1.default.admin, SubscriptionController_1.SubscriptionController.viewPlans);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, SubscriptionController_1.SubscriptionController.addPlan);
    }
    put() {
        this.router.put("/:id", Authnetication_1.default.admin, SubscriptionController_1.SubscriptionController.updatePlan);
    }
}
exports.default = new SubscriptionRouter().router;
