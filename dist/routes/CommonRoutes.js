"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommonController_1 = require("../controllers/CommonController");
const FileUploadMiddleware_1 = require("../Middlewares/FileUploadMiddleware");
class CommonRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/image-upload", FileUploadMiddleware_1.default.upload, CommonController_1.CommonController.uploadImage);
        this.router.post("/file-upload", FileUploadMiddleware_1.default.upload, CommonController_1.CommonController.uploadFile);
        this.router.post("/multiple-image-upload", FileUploadMiddleware_1.default.upload, CommonController_1.CommonController.uploadMultipleImage);
    }
    get() {
    }
}
exports.default = new CommonRoutes().router;
