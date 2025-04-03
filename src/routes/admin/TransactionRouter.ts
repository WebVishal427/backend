import { Router } from "express";
import { TransactionController } from "../../controllers/Admin/TransactionController";
import Authentication from "../../Middlewares/Authnetication";

class TransactionRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.delete();
  }

  public get() {
    this.router.get(
      "/lists",
      Authentication.admin,
      TransactionController.listTransaction
    );
  }

  public delete() {
    this.router.delete(
      "/:id",
      Authentication.admin,
      TransactionController.deleteTransaction
    );
  }
}

export default new TransactionRoute().router;
