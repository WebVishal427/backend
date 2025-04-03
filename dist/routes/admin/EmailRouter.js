"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authnetication_1 = require("../../Middlewares/Authnetication");
const EmailController_1 = require("../../controllers/Admin/EmailController");
class EmailRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
    }
    get() {
        this.router.get("/list", Authnetication_1.default.admin, EmailController_1.EmailController.list);
        this.router.get("/view/:listId", Authnetication_1.default.admin, EmailController_1.EmailController.listById);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, EmailController_1.EmailController.addTemplates);
        this.router.post("/add-edit/:templateId", Authnetication_1.default.admin, EmailController_1.EmailController.EditTemplates);
    }
}
exports.default = new EmailRouter().router;
