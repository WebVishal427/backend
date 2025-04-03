import { Router } from "express";
import { CustomerController } from "../../controllers/Admin/CustomerController";
import Authentication from "../../Middlewares/Authnetication";
import ValidateRequest from "../../Middlewares/ValidateRequest";
import { addCustomerSchema } from "../../validators/app/JoiValidators/Auth.joi";

class CustomerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.put();
    this.delete();
  }

  public post() {
    this.router.post("/add", Authentication.admin, CustomerController.add);
  }

  public put() {
    this.router.put(
      "/:customerId",
      Authentication.admin,
      CustomerController.update
    );
    this.router.put(
      "/status/:customerId",
      Authentication.admin,
      CustomerController.updateStatus
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, CustomerController.list);
    this.router.get(
      "/view/:customerId",
      Authentication.admin,
      CustomerController.view
    );
  }
  public delete() {
    this.router.delete(
      "/delete",
      Authentication.admin,
      CustomerController.delete
    );
  }
}

export default new CustomerRouter().router;
