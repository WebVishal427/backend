import { Router } from "express";
import { CategoryController } from "../../controllers/Admin/CategoryController";
import Authentication from "../../Middlewares/Authnetication";

class WorkoutRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.put();
    this.delete();
  }

  public get() {
    this.router.get(
      "/lists",
      Authentication.admin,
      CategoryController.listCategory
    );
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      CategoryController.addCategory
    );
  }

  public put() {
    this.router.put(
      "/:categoryId",
      Authentication.admin,
      CategoryController.updateCategory
    );
    this.router.put(
      "/status/:categoryId",
      Authentication.admin,
      CategoryController.updateCategoryStatus
    );
  }
  public delete() {
    this.router.delete(
      "/:id",
      Authentication.admin,
      CategoryController.deleteCategory
    );
  }
}

export default new WorkoutRoute().router;
