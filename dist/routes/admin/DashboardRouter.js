"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authnetication_1 = require("../../Middlewares/Authnetication");
const DashboardController_1 = require("../../controllers/Admin/DashboardController");
class DashboardRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
    }
    get() {
        this.router.get("/dashboard-list", Authnetication_1.default.admin, DashboardController_1.DashboardController.getDashboard);
    }
}
exports.default = new DashboardRouter().router;
