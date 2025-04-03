export declare class MailHelper {
    constructor();
    static emailHtml(description: any, ar_description: any): string;
    static sendMail(receiver_mail: any, subject: any, html: any, arHtml?: any): Promise<void>;
}
export default MailHelper;
