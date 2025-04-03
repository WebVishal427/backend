"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authnetication_1 = require("../../Middlewares/Authnetication");
const FeedbackController_1 = require("../../controllers/Admin/FeedbackController");
class FeedbackRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.delete();
    }
    get() {
        this.router.get("/lists-feedback", Authnetication_1.default.admin, FeedbackController_1.FeedbackController.FeedbackList);
    }
    post() {
        this.router.post("/add", FeedbackController_1.FeedbackController.addFeedback);
    }
    delete() {
        this.router.delete("/:feedbackId", FeedbackController_1.FeedbackController.deleteFeedback);
    }
}
exports.default = new FeedbackRouter().router;
