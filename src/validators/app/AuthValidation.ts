import * as Joi from "joi";
import { NextFunction } from "express";
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";

enum LoginTypeRole {
  Google = "Google",
  Facebook = "Facebook",
}

class AuthValidation {
  static async loginValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.string(),
      mobile_number: Joi.string(),
      password: Joi.string().optional().allow("", null),
      device_token: Joi.string().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async signUpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.string().required(),
      mobile_number: Joi.string().required(),
      otp: Joi.number().required(),
      device_token: Joi.string(),
      latitude: Joi.string().optional(),
      longitude: Joi.string().optional(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async sendOtpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.string().required(),
      mobile_number: Joi.string().required(),
    });

    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async socialSignupValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
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
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async verifyOTPValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      mobile_number: Joi.string().required(),
      country_code: Joi.string().required(),
      otp: Joi.number().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async resetPasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.number().optional(),
      mobile_number: Joi.number().optional(),
      password: Joi.string().required().min(6).messages({
        "string.pattern.base": `Password atleast contain 6 characters`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async ChangePasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
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
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default AuthValidation;
