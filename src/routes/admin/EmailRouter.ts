import { Router } from "express";
import { WorkoutController } from "../../controllers/Admin/WorkoutController";
import Authentication from "../../Middlewares/Authnetication";
import { FeedbackController } from "../../controllers/Admin/FeedbackController";
import { EmailController } from "../../controllers/Admin/EmailController";

class EmailRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
  }

  public get() {
    this.router.get("/list", Authentication.admin, EmailController.list);
    this.router.get(
      "/view/:listId",
      Authentication.admin,
      EmailController.listById
    );
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      EmailController.addTemplates
    );
    this.router.post(
      "/add-edit/:templateId",
      Authentication.admin,
      EmailController.EditTemplates
    );
  }
}

export default new EmailRouter().router;
