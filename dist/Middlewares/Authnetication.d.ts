import { Schema } from "joi";
declare class Authentication {
    constructor();
    static userLanguage(req: any, res: any, next: any): Promise<void>;
    static admin(req: any, res: any, next: any): Promise<any>;
    static user(req: any, res: any, next: any): Promise<any>;
    static validateRequest(validationSchema: Schema): (req: any, res: any, next: any) => any;
}
export default Authentication;
