"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const ResponseHelper_1 = require("../helpers/ResponseHelper");
const Env_1 = require("../environments/Env");
const FileUpload_1 = require("../helpers/FileUpload");
class CommonController {
    /**
     * @api {post} /api/common/image-upload Image Upload
     * @apiVersion 1.0.0
     * @apiName Image Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which image you are uploading).
     */
    static uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { image } = req.body.files;
                const { type } = req.body;
                let path = "gaines/" + type;
                const upload = yield FileUpload_1.FileUpload.uploadInS3(image, path);
                return ResponseHelper_1.default.api(res, true, "Image Uploaded Successfully", { upload }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {post} /api/common/file-upload File Upload
     * @apiVersion 1.0.0
     * @apiName File Upload
     * @apiGroup Masters
     * @apiParam {File} file Document file.
     * @apiParam {String} type Type (Ex.Document, Type can be which file you are uploading).
     */
    static uploadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { file } = req.body.files;
                const { type } = req.body;
                let path = "gaines/" + type;
                const upload = yield FileUpload_1.FileUpload.uploadFileInS3(file, path);
                console.log(upload, "upload", (0, Env_1.env)().s3Url);
                return ResponseHelper_1.default.api(res, true, "File Uploaded Successfully", {
                    upload: "https://api-ap-south-mum-1.openstack.acecloudhosting.com:8080/invent-colab-obj-bucket/" +
                        upload,
                }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {post} /api/common/multiple-image-upload Multiple Image Upload
     * @apiVersion 1.0.0
     * @apiName Multiple Image Upload
     * @apiGroup Masters
     * @apiParam {File} images Array of images.
     * @apiParam {String} type Type (Ex.Profile, Type can be which file you are uploading).
     */
    static uploadMultipleImage(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { images } = req.body.files;
                const { type } = req.body;
                let path = "dunnnit/" + type;
                console.log(images, "images");
                console.log(req.body.files, "req.body.files");
                if (!images) {
                    return ResponseHelper_1.default.api(res, false, "Atleast one image is required!", {}, startTime);
                }
                let response = [];
                if (!images.length) {
                    response = yield Promise.all((_a = [images]) === null || _a === void 0 ? void 0 : _a.map((image) => __awaiter(this, void 0, void 0, function* () {
                        const upload = yield FileUpload_1.FileUpload.uploadInS3(image, path);
                        return upload;
                    })));
                }
                else {
                    response = yield Promise.all(images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(this, void 0, void 0, function* () {
                        const upload = yield FileUpload_1.FileUpload.uploadInS3(image, path);
                        return upload;
                    })));
                }
                return ResponseHelper_1.default.api(res, true, "Images Uploaded Successfully", { response }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.CommonController = CommonController;
