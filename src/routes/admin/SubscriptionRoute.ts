import { Router } from "express";
import { SubscriptionController } from "../../controllers/Admin/SubscriptionController";
import Authentication from "../../Middlewares/Authnetication";

class SubscriptionRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.put();
  }

  public get() {
    this.router.get(
      "/viewPlans",
      Authentication.admin,
      SubscriptionController.viewPlans
    );
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      SubscriptionController.addPlan
    );
  }

  public put() {
    this.router.put(
      "/:id",
      Authentication.admin,
      SubscriptionController.updatePlan
    );
  }
}

export default new SubscriptionRouter().router;
