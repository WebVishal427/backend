export declare class AuthController {
    static signup(req: any, res: any, next: any): Promise<void>;
    static login(req: any, res: any, next: any): Promise<any>;
    static resetPassword(req: any, res: any, next: any): Promise<void>;
    static getProfile(req: any, res: any, next: any): Promise<void>;
    static changePassword(req: any, res: any, next: any): Promise<void>;
    static updateProfile(req: any, res: any, next: any): Promise<void>;
    static forgotPassword(req: any, res: any, next: any): Promise<void>;
    static verifyOtp(req: any, res: any, next: any): Promise<void>;
    static isInitialProfileSetup(req: any, res: any, next: any): Promise<void>;
    static DeleteUser(req: any, res: any, next: any): Promise<void>;
    static WorkoutList(req: any, res: any, next: any): Promise<void>;
}
