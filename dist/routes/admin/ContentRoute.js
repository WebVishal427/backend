"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContentController_1 = require("../../controllers/Admin/ContentController");
class ContentRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/:id", ContentController_1.ContentController.UpdatePrivacyPolicy);
    }
    get() {
        this.router.get("/list", ContentController_1.ContentController.list);
    }
}
exports.default = new ContentRoute().router;
