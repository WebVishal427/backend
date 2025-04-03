import { Router } from "express";
import { AuthController } from "../../controllers/Admin/AuthController";
import Authentication from "../../Middlewares/Authnetication";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post("/login", AuthController.login);
    this.router.post("/reset-password", AuthController.resetPassword);
    this.router.post(
      "/change-password",
      Authentication.admin,
      AuthController.changePassword
    );
    this.router.post(
      "/update-profile",
      Authentication.admin,
      AuthController.updateProfile
    );
    this.router.post("/forgot-password", AuthController.forgotPassword);
    this.router.post("/verify-otp", AuthController.verifyOtp);
  }

  public get() {
    this.router.get(
      "/get-profile",
      Authentication.admin,
      AuthController.getProfile
    );
    this.router.get(
      "/dashboard",
      Authentication.admin,
      AuthController.getDashboard
    );
  }
}

export default new AuthRouter().router;
