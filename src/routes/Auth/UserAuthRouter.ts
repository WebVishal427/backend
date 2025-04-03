import { Router } from "express";
import { AuthController } from "../../controllers/Auth/AuthController";
import Authentication from "../../Middlewares/Authnetication";
import { ContentController } from "../../controllers/Auth/ContentController";
import { FeedbackController } from "../../controllers/Auth/FeedbackController";
import {
  fitnessAssessmentSchema,
  signupSchema,
} from "../../validators/app/JoiValidators/Auth.joi";

class UserAuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/signup",
      Authentication.validateRequest(signupSchema),
      AuthController.signup
    );
    this.router.post("/login", AuthController.login);
    this.router.post("/reset-password", AuthController.resetPassword);
    this.router.post(
      "/update-profile",
      Authentication.user,
      AuthController.updateProfile
    );
    this.router.post("/forgot-password", AuthController.forgotPassword);
    this.router.post("/verify-otp", AuthController.verifyOtp);

    this.router.post(
      "/add-feedback",
      Authentication.user,
      FeedbackController.addFeedback
    );
    this.router.post("/delete", AuthController.DeleteUser);
  }

  public put() {
    this.router.put(
      "/fitness-level",
      Authentication.validateRequest(fitnessAssessmentSchema),
      Authentication.user,
      AuthController.isInitialProfileSetup
    );
  }

  public get() {
    this.router.get(
      "/get-profile",
      Authentication.user,
      AuthController.getProfile
    );
    this.router.get(
      "/get-content",
      Authentication.user,
      ContentController.list
    );
    this.router.get(
      "/workout-list",
      Authentication.user,
      AuthController.WorkoutList
    );
  }
}

export default new UserAuthRouter().router;
