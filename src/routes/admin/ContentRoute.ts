import { Router } from "express";
import { ContentController } from "../../controllers/Admin/ContentController";

class ContentRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post("/:id", ContentController.UpdatePrivacyPolicy);
  }
  public get() {
    this.router.get("/list", ContentController.list);
  }
}

export default new ContentRoute().router;
