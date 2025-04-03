import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { NotificationController } from "../../controllers/Auth/NotificationController";

class NotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    //this.get();
    // this.put();
  }
  public post() {
    this.router.post(
      "/send-notification",
      Authentication.user,
      NotificationController.SendAllNotification
    );
  }
}

export default new NotificationRouter().router;
