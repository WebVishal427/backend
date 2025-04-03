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
exports.FileUpload = void 0;
const Env_1 = require("../environments/Env");
const AWS = require("aws-sdk");
const fs = require("fs");
const Helper_1 = require("./Helper");
// AWS.config.update({
//   accessKeyId: "K1MA6JS74TD9HJNGIFOV" || env().awsAccessKey,
//   secretAccessKey: "GyBsB9qOU1o97IqplcQJSO4r3GBpnmM7vGXBWvOA" || env().awsSecretKey,
//   region: env().region,
// });
class FileUpload {
    constructor() { }
    static uploadInS3(image, path) {
        let folderPath = path;
        let fileExtension = '.png';
        const imageRemoteName = `${folderPath}/image_${new Date().getTime()}${fileExtension}`;
        return FileUpload.s3
            .putObject({
            Bucket: (0, Env_1.env)().s3Bucket,
            Body: fs.readFileSync(image.filepath),
            ContentType: image.mimetype,
            Key: imageRemoteName,
        })
            .promise()
            .then((response) => {
            console.log(response);
            return imageRemoteName;
        })
            .catch((err) => {
            console.log("failed:", err);
            return false;
        });
    }
    static uploadFileInS3(file, path) {
        return __awaiter(this, void 0, void 0, function* () {
            let folderPath = path;
            const extension = yield Helper_1.default.getFileExtension(file.originalFilename);
            const imageRemoteName = `/${folderPath}/file_${new Date().getTime()}.${extension}`;
            return FileUpload.s3
                .putObject({
                Bucket: (0, Env_1.env)().s3Bucket,
                Body: fs.readFileSync(file.filepath),
                ContentType: file.mimetype,
                Key: imageRemoteName,
            })
                .promise()
                .then((response) => {
                console.log(response);
                return imageRemoteName;
            })
                .catch((err) => {
                console.log("failed:", err);
                return false;
            });
        });
    }
    static deleteFromS3(path) {
        const params = {
            Bucket: (0, Env_1.env)().s3Bucket,
            Delete: {
                Objects: [
                    {
                        Key: path,
                    },
                ],
            },
        };
        return FileUpload.s3
            .deleteObjects(params)
            .promise()
            .then((response) => {
            console.log("Deleted success", response);
            return true;
        })
            .catch((error) => {
            console.log("failed:", error);
            return false;
        });
    }
}
exports.FileUpload = FileUpload;
// static s3 = new AWS.S3();
FileUpload.s3 = new AWS.S3({
    endpoint: "https://api-ap-south-mum-1.openstack.acecloudhosting.com:8080/",
    accessKeyId: "K1MA6JS74TD9HJNGIFOV",
    secretAccessKey: "GyBsB9qOU1o97IqplcQJSO4r3GBpnmM7vGXBWvOA",
    region: "us-east-1",
    s3ForcePathStyle: true,
});
exports.default = FileUpload;
