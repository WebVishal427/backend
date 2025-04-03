"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authnetication_1 = require("../../Middlewares/Authnetication");
const NotificationController_1 = require("../../controllers/Auth/NotificationController");
class NotificationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        //this.get();
        // this.put();
    }
    post() {
        this.router.post("/send-notification", Authnetication_1.default.user, NotificationController_1.NotificationController.SendAllNotification);
    }
}
exports.default = new NotificationRouter().router;
