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
                email: Joi.string().required(),
                otp: Joi.string().optional().allow('', null),
                password: Joi.string().optional().allow('', null),
                device_token: Joi.string(),
                device_type: Joi.string(),
                type: Joi.string().optional().allow('', null),
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
                name: Joi.string().required(),
                ar_name: Joi.string().required(),
                email: Joi.string().email().required(),
                cr: Joi.string().required(),
                license: Joi.string().required(),
                vat: Joi.string().required(),
                banner: Joi.string().required(),
                store_name: Joi.string().required(),
                ar_store_name: Joi.string().required(),
                store_location: Joi.string().required(),
                country_code: Joi.number().required(),
                mobile_number: Joi.number().required(),
                tnc: Joi.boolean().optional(),
                device_token: Joi.string(),
                device_type: Joi.string(),
                latitude: Joi.number().optional(),
                longitude: Joi.number().optional(),
                password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    "string.pattern.base": `Password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
                    "string.empty": `Password cannot be empty`,
                    "any.required": `Password is required`,
                }),
                type: Joi.string().optional().allow('', null),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static forgotPasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                // mobile_number: Joi.number().required(),
                // type: Joi.string().optional().allow('', null),
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
                login_type: Joi.string().required(),
                // email: Joi.string().email(),
                // country_code: Joi.number(),
                // mobile_number: Joi.number(),
                email: Joi.when('login_type', {
                    is: 'email',
                    then: Joi.string().email().required(),
                    otherwise: Joi.string().allow('').optional() // or any other validation for non-email value of 'b'
                }),
                country_code: Joi.when('login_type', {
                    is: 'phone',
                    then: Joi.number().required(),
                    otherwise: Joi.string().allow('').optional() // or any other validation for non-email value of 'b'
                }),
                mobile_number: Joi.when('login_type', {
                    is: 'phone',
                    then: Joi.number().required(),
                    otherwise: Joi.string().allow('').optional() // or any other validation for non-email value of 'b'
                }),
                type: Joi.string().optional().allow('', null),
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
                country_code: Joi.number().optional(),
                mobile_number: Joi.number().optional(),
                device_type: Joi.string().optional(),
                login_type: Joi.string().required(),
                social_id: Joi.string().required(),
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
                email: Joi.string().required(),
                otp: Joi.number().required(),
                isVerify: Joi.boolean().optional().allow('', null),
                type: Joi.string().optional().allow('', null),
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
                email: Joi.string().email().optional(),
                type: Joi.string().optional().allow(null, ''),
                password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    "string.pattern.base": `Password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
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
                old_password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    "string.pattern.base": `Password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
                    "string.empty": `Password cannot be empty`,
                    "any.required": `Password is required`,
                }),
                new_password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    "string.pattern.base": `New password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
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
