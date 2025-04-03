"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/Auth/AuthController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
const ContentController_1 = require("../../controllers/Auth/ContentController");
const FeedbackController_1 = require("../../controllers/Auth/FeedbackController");
const Auth_joi_1 = require("../../validators/app/JoiValidators/Auth.joi");
class UserAuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
        this.put();
    }
    post() {
        this.router.post("/signup", Authnetication_1.default.validateRequest(Auth_joi_1.signupSchema), AuthController_1.AuthController.signup);
        this.router.post("/login", AuthController_1.AuthController.login);
        this.router.post("/reset-password", AuthController_1.AuthController.resetPassword);
        this.router.post("/update-profile", Authnetication_1.default.user, AuthController_1.AuthController.updateProfile);
        this.router.post("/forgot-password", AuthController_1.AuthController.forgotPassword);
        this.router.post("/verify-otp", AuthController_1.AuthController.verifyOtp);
        this.router.post("/add-feedback", Authnetication_1.default.user, FeedbackController_1.FeedbackController.addFeedback);
        this.router.post("/delete", AuthController_1.AuthController.DeleteUser);
    }
    put() {
        this.router.put("/fitness-level", Authnetication_1.default.validateRequest(Auth_joi_1.fitnessAssessmentSchema), Authnetication_1.default.user, AuthController_1.AuthController.isInitialProfileSetup);
    }
    get() {
        this.router.get("/get-profile", Authnetication_1.default.user, AuthController_1.AuthController.getProfile);
        this.router.get("/get-content", Authnetication_1.default.user, ContentController_1.ContentController.list);
        this.router.get("/workout-list", Authnetication_1.default.user, AuthController_1.AuthController.WorkoutList);
    }
}
exports.default = new UserAuthRouter().router;
