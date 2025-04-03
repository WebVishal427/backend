"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommonRoutes_1 = require("./CommonRoutes");
const AuthRouter_1 = require("./admin/AuthRouter");
const CustomerRouter_1 = require("./admin/CustomerRouter");
const SubscriptionRoute_1 = require("./admin/SubscriptionRoute");
const CategoryRouter_1 = require("./admin/CategoryRouter");
const BodyPartRouter_1 = require("./admin/BodyPartRouter");
const TransactionRouter_1 = require("./admin/TransactionRouter");
const ExerciseRouter_1 = require("./admin/ExerciseRouter");
const WorkoutRouter_1 = require("./admin/WorkoutRouter");
const FeedbackRouter_1 = require("./admin/FeedbackRouter");
const EmailRouter_1 = require("./admin/EmailRouter");
const ContentRoute_1 = require("./admin/ContentRoute");
const UserAuthRouter_1 = require("./Auth/UserAuthRouter");
const NotificationRouter_1 = require("./Auth/NotificationRouter");
class Routes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.admin();
        this.auth();
        this.common();
    }
    app() { }
    admin() {
        this.router.use("/admin/auth", AuthRouter_1.default);
        this.router.use("/admin/notifications", NotificationRouter_1.default);
        this.router.use("/admin/customer", CustomerRouter_1.default);
        this.router.use("/admin/subscription", SubscriptionRoute_1.default);
        this.router.use("/admin/category", CategoryRouter_1.default);
        this.router.use("/admin/bodyParts", BodyPartRouter_1.default);
        this.router.use("/admin/exercise", ExerciseRouter_1.default);
        this.router.use("/admin/transaction", TransactionRouter_1.default);
        this.router.use("/admin/workout", WorkoutRouter_1.default);
        this.router.use("/admin/feedback", FeedbackRouter_1.default);
        this.router.use("/admin/email-template", EmailRouter_1.default);
        this.router.use("/admin/content", ContentRoute_1.default);
    }
    auth() {
        this.router.use("/user/auth", UserAuthRouter_1.default);
    }
    common() {
        this.router.use("/common", CommonRoutes_1.default);
    }
}
exports.default = new Routes().router;
