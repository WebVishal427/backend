import _RS from "../helpers/ResponseHelper";
import Auth from "../Utils/Auth";
import { getLanguageStrings } from "../locale";
import * as mongoose from "mongoose";
import { supabase } from "../config/supabase";
import { Schema } from "joi";

class Authentication {
  constructor() {}

  static async userLanguage(req, res, next) {
    let language = req.headers.language ?? "en";
    const lang = getLanguageStrings(language);
    req.lang = lang;
    next();
  }

  static async admin(req, res, next) {
    const startTime = new Date().getTime();
    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return _RS.unAuthenticated(
          res,
          "UNAUTHORIZED",
          "Un-Authorized",
          {},
          startTime,
          0
        );
      }

      const decoded: any = await Auth.decodeJwt(token);

      // const currentUser = await supabase.auth.getUser(token)
      const { data: admin, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!admin) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Admin doesn't exists with us",
          admin,
          startTime
        );
      }

      req.user = admin;
      req.user.id = decoded.id;
      req.user.type = decoded.type;
      next();
    } catch (err) {
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
  static async user(req, res, next) {
    const startTime = new Date().getTime();
    try {
      let token;

      // Check if authorization header exists and contains Bearer token
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      // If no token is provided, return unauthorized error
      if (!token) {
        return _RS.unAuthenticated(
          res,
          "UNAUTHORIZED",
          "Un-Authorized",
          {},
          startTime,
          0
        );
      }

      // Decode the JWT token to get user details
      const decoded: any = await Auth.decodeJwt(token);

      // Fetch user data from the database
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If user doesn't exist, return not found error
      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User doesn't exist with us",
          user,
          startTime
        );
      }

      // Attach user data to the request for future use
      req.user = user;
      req.user.id = decoded.id;
      req.user.type = decoded.type; // Assuming type could be 'user' or something else
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
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
  }

  static validateRequest(validationSchema: Schema) {
    return (req, res, next) => {
      const startTime = new Date().getTime();
      try {
        const data = req.body;
        const { error, value } = validationSchema.validate(data);
        if (error) {
          return _RS.badRequest(
            res,
            "BADREQUEST",
            error.message,
            {},
            startTime
          );
        }

        req.body = value;
        next();
      } catch (e) {
        console.error("Error in request schema validation", e);
        return next(e);
      }
    };
  }
}

export default Authentication;
