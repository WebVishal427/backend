export declare class CommonController {
    /**
     * @api {post} /api/common/image-upload Image Upload
     * @apiVersion 1.0.0
     * @apiName Image Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which image you are uploading).
     */
    static uploadImage(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/common/file-upload File Upload
     * @apiVersion 1.0.0
     * @apiName File Upload
     * @apiGroup Masters
     * @apiParam {File} file Document file.
     * @apiParam {String} type Type (Ex.Document, Type can be which file you are uploading).
     */
    static uploadFile(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/common/multiple-image-upload Multiple Image Upload
     * @apiVersion 1.0.0
     * @apiName Multiple Image Upload
     * @apiGroup Masters
     * @apiParam {File} images Array of images.
     * @apiParam {String} type Type (Ex.Profile, Type can be which file you are uploading).
     */
    static uploadMultipleImage(req: any, res: any, next: any): Promise<void>;
}
