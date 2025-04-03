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
const Joi = require("joi");
const ValidationHelper_1 = require("../../helpers/ValidationHelper");
var LoginTypeRole;
(function (LoginTypeRole) {
    LoginTypeRole["Google"] = "Google";
    LoginTypeRole["Facebook"] = "Facebook";
})(LoginTypeRole || (LoginTypeRole = {}));
class AuthValidation {
    static loginValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.string(),
                mobile_number: Joi.string(),
                password: Joi.string().optional().allow("", null),
                device_token: Joi.string().optional().allow("", null),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static signUpValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.string().required(),
                mobile_number: Joi.string().required(),
                otp: Joi.number().required(),
                device_token: Joi.string(),
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static sendOtpValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.string().required(),
                mobile_number: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static socialSignupValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                name: Joi.string().optional(),
                email: Joi.string().email().required(),
                device_token: Joi.string().optional(),
                country_code: Joi.optional().allow(null, ""),
                mobile_number: Joi.optional().allow(null, ""),
                device_type: Joi.string().optional(),
                login_type: Joi.string().required(),
                social_id: Joi.string().required(),
                user_image: Joi.optional().allow(null, ""),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static verifyOTPValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                mobile_number: Joi.string().required(),
                country_code: Joi.string().required(),
                otp: Joi.number().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static resetPasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.number().optional(),
                mobile_number: Joi.number().optional(),
                password: Joi.string().required().min(6).messages({
                    "string.pattern.base": `Password atleast contain 6 characters`,
                    "string.empty": `Password cannot be empty`,
                    "any.required": `Password is required`,
                }),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static ChangePasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                old_password: Joi.string().required().min(6).messages({
                    "string.pattern.base": `Password atleast contain 6 characters`,
                    "string.empty": `Password cannot be empty`,
                    "any.required": `Password is required`,
                }),
                new_password: Joi.string().required().min(6).messages({
                    "string.pattern.base": `New password atleast contain 6 characters`,
                    "string.empty": `New password cannot be empty`,
                    "any.required": `New password is required`,
                }),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
}
exports.default = AuthValidation;
