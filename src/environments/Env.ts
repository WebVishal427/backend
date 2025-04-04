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

export function env(): Environment {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DB_URL || 'default_db_url',
    baseUrl: process.env.BASE_URL || 'default_base_url',
    awsSecretKey: process.env.aws_access_key || 'default_aws_secret_key',
    awsAccessKey: process.env.aws_secret_key || 'default_aws_access_key',
    region: process.env.region || 'default_region',
    s3Bucket: process.env.s3_bucket || 'default_s3_bucket',
    s3Url: process.env.S3URL || 'default_s3_url'
  };
}
