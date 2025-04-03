import { Router } from "express";
import { CommonController } from "../controllers/CommonController";
import UploadFiles from "../Middlewares/FileUploadMiddleware";
import ValidateRequest from "../Middlewares/ValidateRequest";
import _RS from "../helpers/ResponseHelper";

class CommonRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/image-upload",
      UploadFiles.upload,
      CommonController.uploadImage
    );

    this.router.post(
      "/file-upload",
      UploadFiles.upload,
      CommonController.uploadFile
    );

    this.router.post(
      "/multiple-image-upload",
      UploadFiles.upload,
      CommonController.uploadMultipleImage
    );
  }

  public get() {
  }
}

export default new CommonRoutes().router;
