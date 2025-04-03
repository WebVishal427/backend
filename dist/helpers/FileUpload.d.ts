import { S3 } from "aws-sdk";
export declare class FileUpload {
    constructor();
    static s3: S3;
    static uploadInS3(image: any, path: any): Promise<string | boolean>;
    static uploadFileInS3(file: any, path: any): Promise<string | boolean>;
    static deleteFromS3(path: any): Promise<boolean>;
}
export default FileUpload;
