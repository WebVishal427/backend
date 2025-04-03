declare class Helper {
    adminId: string;
    generatePassword(length: any, options: any): Promise<string>;
    generateRandomString(length: any, options: any): Promise<string>;
    generateAlphaString(length: any): Promise<string>;
    sendInvoice(receiver_mail: any, subject: any, description: any): Promise<boolean>;
    getFileExtension(url: any): Promise<any>;
    getYearAndMonth(data: any): Promise<{
        years: any[];
        months: any[];
    }>;
}
declare const _default: Helper;
export default _default;
