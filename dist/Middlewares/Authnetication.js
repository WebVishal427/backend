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
const ResponseHelper_1 = require("../helpers/ResponseHelper");
const Auth_1 = require("../Utils/Auth");
const locale_1 = require("../locale");
const supabase_1 = require("../config/supabase");
class Authentication {
    constructor() { }
    static userLanguage(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let language = (_a = req.headers.language) !== null && _a !== void 0 ? _a : "en";
            const lang = (0, locale_1.getLanguageStrings)(language);
            req.lang = lang;
            next();
        });
    }
    static admin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let token;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith("Bearer")) {
                    token = req.headers.authorization.split(" ")[1];
                }
                if (!token) {
                    return ResponseHelper_1.default.unAuthenticated(res, "UNAUTHORIZED", "Un-Authorized", {}, startTime, 0);
                }
                const decoded = yield Auth_1.default.decodeJwt(token);
                // const currentUser = await supabase.auth.getUser(token)
                const { data: admin, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("*")
                    .eq("id", decoded.id)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError;
                if (!admin) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "Admin doesn't exists with us", admin, startTime);
                }
                req.user = admin;
                req.user.id = decoded.id;
                req.user.type = decoded.type;
                next();
            }
            catch (err) {
                console.log(err, "err");
                if (err.message == "jwt expired") {
                    res.status(403).json({
                        status: 403,
                        statusText: "JWT_EXPIRED",
                        message: "JWT_EXPIRED",
                    });
                }
                return next(err);
            }
        });
    }
    // static async user(req, res, next) {
    //   const startTime = new Date().getTime();
    //   try {
    //     let token;
    //     if (
    //       req.headers.authorization &&
    //       req.headers.authorization.startsWith("Bearer")
    //     ) {
    //       token = req.headers.authorization.split(" ")[1];
    //     }
    //     if (!token) {
    //       return _RS.unAuthenticated(
    //         res,
    //         "UNAUTHORIZE",
    //         "UNAUTHORIZE",
    //         {},
    //         startTime,
    //         0
    //       );
    //     }
    //     const decoded: any = await Auth.decodeJwt(token);
    //     const currentUser = await User.findById(decoded.id);
    //     if (!currentUser) {
    //       return _RS.unAuthenticated(
    //         res,
    //         "UNAUTHORIZE",
    //         "UNAUTHORIZE",
    //         {},
    //         startTime,
    //         0
    //       );
    //     }
    //     if (!currentUser.isActive) {
    //       return _RS.unAuthorize(
    //         res,
    //         "FORBIDDEN",
    //         "Account Deactivated Please contact to admin",
    //         {},
    //         startTime
    //       );
    //     }
    //     if (currentUser.isDeleted) {
    //       return _RS.unAuthorize(
    //         res,
    //         "FORBIDDEN",
    //         "Account Delete Please Use another email",
    //         {},
    //         startTime
    //       );
    //     }
    //     req.user = currentUser;
    //     req.user.id = decoded.id;
    //     req.user.type = decoded.type;
    //     next();
    //   } catch (err) {
    //     return next(err);
    //   }
    // }
    static user(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let token;
                // Check if authorization header exists and contains Bearer token
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith("Bearer")) {
                    token = req.headers.authorization.split(" ")[1];
                }
                // If no token is provided, return unauthorized error
                if (!token) {
                    return ResponseHelper_1.default.unAuthenticated(res, "UNAUTHORIZED", "Un-Authorized", {}, startTime, 0);
                }
                // Decode the JWT token to get user details
                const decoded = yield Auth_1.default.decodeJwt(token);
                // Fetch user data from the database
                const { data: user, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("*")
                    .eq("id", decoded.id)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError;
                // If user doesn't exist, return not found error
                if (!user) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User doesn't exist with us", user, startTime);
                }
                // Attach user data to the request for future use
                req.user = user;
                req.user.id = decoded.id;
                req.user.type = decoded.type; // Assuming type could be 'user' or something else
                next(); // Proceed to the next middleware or route handler
            }
            catch (err) {
                console.log(err, "err");
                // If JWT is expired, return a 403 error
                if (err.message === "jwt expired") {
                    return res.status(403).json({
                        status: 403,
                        statusText: "JWT_EXPIRED",
                        message: "JWT_EXPIRED",
                    });
                }
                // Pass any other errors to the next error handler
                return next(err);
            }
        });
    }
    static validateRequest(validationSchema) {
        return (req, res, next) => {
            const startTime = new Date().getTime();
            try {
                const data = req.body;
                const { error, value } = validationSchema.validate(data);
                if (error) {
                    return ResponseHelper_1.default.badRequest(res, "BADREQUEST", error.message, {}, startTime);
                }
                req.body = value;
                next();
            }
            catch (e) {
                console.error("Error in request schema validation", e);
                return next(e);
            }
        };
    }
}
exports.default = Authentication;
