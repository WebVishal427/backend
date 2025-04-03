export interface Environment {
    nodeEnv: string;
    dbUrl: string;
    baseUrl: string;
    awsSecretKey: string;
    awsAccessKey: string;
    region: string;
    s3Bucket: string;
    s3Url: string;
}
export declare function env(): Environment;
