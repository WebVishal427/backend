import _RS from "../helpers/ResponseHelper";
import { env } from "../environments/Env";
import { FileUpload } from "../helpers/FileUpload";

export class CommonController {
  /**
   * @api {post} /api/common/image-upload Image Upload
   * @apiVersion 1.0.0
   * @apiName Image Upload
   * @apiGroup Masters
   * @apiParam {File} image Image.
   * @apiParam {String} type Type (Ex.Profile, Type can be which image you are uploading).
   */
  static async uploadImage(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { image } = req.body.files;
      const { type } = req.body;
      let path: any = "gaines/" + type;
      const upload = await FileUpload.uploadInS3(image, path);
      return _RS.api(
        res,
        true,
        "Image Uploaded Successfully",
        { upload },
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {post} /api/common/file-upload File Upload
   * @apiVersion 1.0.0
   * @apiName File Upload
   * @apiGroup Masters
   * @apiParam {File} file Document file.
   * @apiParam {String} type Type (Ex.Document, Type can be which file you are uploading).
   */
  static async uploadFile(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { file } = req.body.files;
      const { type } = req.body;
      let path: any = "gaines/" + type;

      const upload = await FileUpload.uploadFileInS3(file, path);
      console.log(upload, "upload", env().s3Url);

      return _RS.api(
        res,
        true,
        "File Uploaded Successfully",
        {
          upload:
            "https://api-ap-south-mum-1.openstack.acecloudhosting.com:8080/invent-colab-obj-bucket/" +
            upload,
        },
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {post} /api/common/multiple-image-upload Multiple Image Upload
   * @apiVersion 1.0.0
   * @apiName Multiple Image Upload
   * @apiGroup Masters
   * @apiParam {File} images Array of images.
   * @apiParam {String} type Type (Ex.Profile, Type can be which file you are uploading).
   */
  static async uploadMultipleImage(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { images } = req.body.files;
      const { type } = req.body;
      let path: any = "dunnnit/" + type;
      console.log(images, "images");
      console.log(req.body.files, "req.body.files");

      if (!images) {
        return _RS.api(
          res,
          false,
          "Atleast one image is required!",
          {},
          startTime
        );
      }

      let response = [];

      if (!images.length) {
        response = await Promise.all(
          [images]?.map(async (image) => {
            const upload = await FileUpload.uploadInS3(image, path);
            return upload;
          })
        );
      } else {
        response = await Promise.all(
          images?.map(async (image) => {
            const upload = await FileUpload.uploadInS3(image, path);
            return upload;
          })
        );
      }

      return _RS.api(
        res,
        true,
        "Images Uploaded Successfully",
        { response },
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

}
