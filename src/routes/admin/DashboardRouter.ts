import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { DashboardController } from "../../controllers/Admin/DashboardController";

class DashboardRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
  }

  public get() {
    this.router.get(
      "/dashboard-list",
      Authentication.admin,
      DashboardController.getDashboard
    );
  }
}

export default new DashboardRouter().router;
