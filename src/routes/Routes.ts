import { Router } from "express";

import CommonRoutes from "./CommonRoutes";

import AuthRouter from "./admin/AuthRouter";
import CustomerRouter from "./admin/CustomerRouter";
import SubscriptionRoute from "./admin/SubscriptionRoute";
import CategoryRoute from "./admin/CategoryRouter";
import BodyPartRouter from "./admin/BodyPartRouter";
import TransactionRouter from "./admin/TransactionRouter";
import ExerciseRouter from "./admin/ExerciseRouter";
import WorkoutRouter from "./admin/WorkoutRouter";
import FeedbackRouter from "./admin/FeedbackRouter";
import EmailRouter from "./admin/EmailRouter";
import ContentRouter from "./admin/ContentRoute";
import UserAuthRouter from "./Auth/UserAuthRouter";
import { NotificationController } from "../controllers/Auth/NotificationController";
import NotificationRouter from "./Auth/NotificationRouter";
import DashboardRouter from "./admin/DashboardRouter";
class Routes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.admin();
    this.auth();
    this.common();
  }

  app() {}

  admin() {
    this.router.use("/admin/auth", AuthRouter);
    this.router.use("/admin/notifications", NotificationRouter);
    this.router.use("/admin/customer", CustomerRouter);
    this.router.use("/admin/subscription", SubscriptionRoute);
    this.router.use("/admin/category", CategoryRoute);
    this.router.use("/admin/bodyParts", BodyPartRouter);
    this.router.use("/admin/exercise", ExerciseRouter);
    this.router.use("/admin/transaction", TransactionRouter);
    this.router.use("/admin/workout", WorkoutRouter);
    this.router.use("/admin/feedback", FeedbackRouter);
    this.router.use("/admin/email-template", EmailRouter);
    this.router.use("/admin/content", ContentRouter);
  }

  auth() {
    this.router.use("/user/auth", UserAuthRouter);
  }

  common() {
    this.router.use("/common", CommonRoutes);
  }
}
export default new Routes().router;
