"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/Admin/AuthController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/login", AuthController_1.AuthController.login);
        this.router.post("/reset-password", AuthController_1.AuthController.resetPassword);
        this.router.post("/change-password", Authnetication_1.default.admin, AuthController_1.AuthController.changePassword);
        this.router.post("/update-profile", Authnetication_1.default.admin, AuthController_1.AuthController.updateProfile);
        this.router.post("/forgot-password", AuthController_1.AuthController.forgotPassword);
        this.router.post("/verify-otp", AuthController_1.AuthController.verifyOtp);
    }
    get() {
        this.router.get("/get-profile", Authnetication_1.default.admin, AuthController_1.AuthController.getProfile);
        this.router.get("/dashboard", Authnetication_1.default.admin, AuthController_1.AuthController.getDashboard);
    }
}
exports.default = new AuthRouter().router;
