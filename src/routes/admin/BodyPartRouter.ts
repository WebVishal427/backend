import { Router } from "express";
import { BodyPartsController } from "../../controllers/Admin/BodyPartsController";
import Authentication from "../../Middlewares/Authnetication";

class BodyPartRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.put();
    this.delete();
  }

  public get() {
    this.router.get("/lists", Authentication.admin, BodyPartsController.list);
  }

  public post() {
    this.router.post("/add", Authentication.admin, BodyPartsController.add);
  }

  public put() {
    this.router.put(
      "/:bodyPartId",
      Authentication.admin,
      BodyPartsController.update
    );
    this.router.put(
      "/status/:bodyPartId",
      Authentication.admin,
      BodyPartsController.updateStatus
    );
  }
  public delete() {
    this.router.delete(
      "/:id",
      Authentication.admin,
      BodyPartsController.delete
    );
  }
}

export default new BodyPartRouter().router;
