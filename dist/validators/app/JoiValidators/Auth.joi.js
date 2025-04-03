"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomerSchema = exports.fitnessAssessmentSchema = exports.updateProfileSchema = exports.verifyOtpEmailSchema = exports.verifyOtpMobileSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const Joi = require("joi");
exports.signupSchema = Joi.object({
    email: Joi.string().required().email(),
    device_type: Joi.string().required().valid("ios", "android"),
    fcm_token: Joi.string().required(),
    password: Joi.string().required(),
});
exports.loginSchema = Joi.object({
    email: Joi.string().required().email(),
    device_type: Joi.string().required().valid("ios", "android"),
    fcm_token: Joi.string().required(),
    password: Joi.string().required(),
});
exports.forgotPasswordSchema = Joi.object({
    email: Joi.string().required().email(),
});
exports.verifyOtpMobileSchema = Joi.object({
    phone_number: Joi.string().required(),
    otp: Joi.number().required(),
});
exports.verifyOtpEmailSchema = Joi.object({
    phone_number: Joi.string().required().email(),
    otp: Joi.number().required(),
});
exports.updateProfileSchema = Joi.object({
    name: Joi.string(),
    image: Joi.string().uri({ scheme: ["https", "http"] }),
    email: Joi.string().email(),
    password: Joi.string(),
    account_type: Joi.string().valid("user", "coach", "nutritionist"),
    weight: Joi.number().max(635).min(1),
    gender: Joi.string().valid("male", "female"),
    location: Joi.string(),
});
exports.fitnessAssessmentSchema = Joi.object({
    traning_for_sport: Joi.string(),
    gender: Joi.string().valid("male", "female"),
    weight: Joi.number().max(635).min(1),
    age: Joi.number().max(150).min(1),
    experience: Joi.boolean(),
    fitness_level: Joi.number().max(5).min(1),
    physical_limitation: Joi.array().items(Joi.string()),
});
exports.addCustomerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    mobileNumber: Joi.string().required(),
    countryCode: Joi.string().required(),
});
