import { Router } from "express";
import { WorkoutController } from "../../controllers/Admin/WorkoutController";
import Authentication from "../../Middlewares/Authnetication";
import { FeedbackController } from "../../controllers/Admin/FeedbackController";

class FeedbackRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.delete();
  }

  public get() {
    this.router.get(
      "/lists-feedback",
      Authentication.admin,
      FeedbackController.FeedbackList
    );
  }

  public post() {
    this.router.post("/add", FeedbackController.addFeedback);
  }

  public delete() {
    this.router.delete("/:feedbackId", FeedbackController.deleteFeedback);
  }
}

export default new FeedbackRouter().router;
