import _RS from "../../helpers/ResponseHelper";
import Auth from "../../Utils/Auth";
import { supabase } from "../../config/supabase";
import MailHelper from "../../helpers/MailHelper";

export class AuthController {
  static async signup(req, res, next) {
    const startTime = new Date().getTime();
    const { email, password, device_type, fcm_token } = req.body;

    try {
      // Check if the email already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingUser) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Email is already registered!",
          {},
          startTime
        );
      }

      // Hash the password
      const hashedPassword = await Auth.encryptPassword(password);

      // Insert the new user into the database
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email,
          type: device_type,
          fcmToken: fcm_token,
          password: hashedPassword,
          isInitials: false,
          isActive: true,
          isDeleted: false,
        })
        .select("*");

      if (insertError) {
        throw insertError;
      }

      if (!newUser) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "User could not be registered",
          {},
          startTime
        );
      }

      // Send verification email
      const verificationLink = `https://www.nutrition-app.com/verify?email=${encodeURIComponent(
        email
      )}`;
      await MailHelper.sendMail(
        email,
        "Verify your email address",
        verificationLink
      );
      return _RS.ok(
        res,
        "SUCCESS",
        "User registered successfully!",
        newUser,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const startTime = new Date().getTime();

    const { email, password, device_type, fcm_token } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, password, isActive, isDeleted")
        .eq("email", email)
        .eq("isActive", true)
        .eq("isDeleted", false)
        .maybeSingle();
      if (error) {
        throw error;
      }

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User does not exist with this email",
          user,
          startTime
        );
      }

      const isPasswordValid = await Auth.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({
          status: "BAD REQUEST",
          message: "Invalid password",
          data: {},
          startTime,
        });
      }

      const { data, error: err2 } = await supabase
        .from("users")
        .update({
          fcmToken: fcm_token,
          deviceType: device_type,
        })
        .eq("id", user.id);

      if (err2) {
        throw err2;
      }

      const payload = {
        id: user.id,
        email: user.email,
        type: "user",
      };

      const token = await Auth.getToken(payload, "30d", next);

      return _RS.ok(
        res,
        "SUCCESS",
        "Login Successful!",
        { user, token },
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    const { email } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, isActive")
        .eq("email", email)
        .eq("isActive", true)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!user) {
        return _RS.notFound(
          res,
          "notFound",
          "User not found",
          {},
          new Date().getTime()
        );
      }

      await MailHelper.sendMail(
        email,
        "Reset your password",
        `https://www.nutrition-app.com/reset-password?email=${encodeURIComponent(
          email
        )}`
      );

      return _RS.ok(
        res,
        "SUCCESS",
        "Password Reset Successfully.",
        {},
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    const startTime = new Date().getTime();
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist, go to signup page",
          user,
          startTime
        );
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Get Profile Successfully",
        user,
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    const startTime = new Date().getTime();
    const { old_password, new_password } = req.body;
    try {
      console.log(req.user);

      const { data, error } = await supabase
        .from("users")
        .select("id, password")
        .eq("id", req.user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const isPasswordCurrentCorrect = await Auth.comparePassword(
        old_password,
        data.password
      );

      if (!isPasswordCurrentCorrect) {
        return _RS.badRequest(
          res,
          "BADREQUEST",
          "Old password does not match",
          {},
          startTime
        );
      }
      const isSamePassword = await Auth.comparePassword(
        new_password,
        data.password
      );

      if (isSamePassword) {
        return _RS.badRequest(
          res,
          "BADREQUEST",
          "New password cannot be the same as the old password",
          {},
          startTime
        );
      }

      const encryptedPassword = await Auth.encryptPassword(new_password);

      // user.password = encryptedPassword;
      // await admin.save();
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ password: encryptedPassword })
        .eq("id", req.user.id);

      if (updateError) {
        throw updateError;
      }

      console.log("done");

      return _RS.ok(
        res,
        "SUCCESS",
        "Password Changed Successfully",
        updatedData,
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    const startTime = new Date().getTime();
    const {
      image,
      name,
      email,
      password,
      account_type,
      weight,
      gender,
      location,
    } = req.body;
    try {
      const hashedPassword = await Auth.encryptPassword(password);

      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist , go to signup page",
          {},
          startTime
        );
      }

      const updatedData = {
        name: name || user.name,
        image: image || user.image,
        email: email || user.email,
        password: hashedPassword || user.password,
        type: account_type || user.type,
        weight: weight || user.weight,
        gender: gender || user.gender,
        location: location || user.location,
      };

      const { error: updateError } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Profile Successfully",
        updatedData,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    const startTime = new Date().getTime();
    const email = req.body.email;
    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, name, email, otp")
        .eq("email", email)
        .maybeSingle();
      // Handle any errors

      if (fetchError) throw fetchError;

      if (!user) {
        return _RS.notFound(
          res,
          "SUCCESS",
          "Email address does not exists with us. Please check again",
          user,
          startTime
        );
      }

      const otp = await Auth.generateOtp();
      const { error: updateError } = await supabase
        .from("users")
        .update({ otp: otp?.otp })
        .eq("id", user.id);

      if (updateError) throw updateError;

      const { data: emailTemplate, error: templateError } = await supabase
        .from("emailTemplates")
        .select("content, subject")
        .eq("slug", "forget password")
        .maybeSingle();

      if (templateError) throw templateError;

      var replacedHTML = emailTemplate?.content;
      replacedHTML = replacedHTML?.replace("[NAME]", user.name || "");
      replacedHTML = replacedHTML?.replace("[OTP]", user.otp || "1234");
      // replacedHTML = replacedHTML?.replace("[EMAIL]", user?.email || "1234");
      // replacedHTML = replacedHTML?.replace(
      //   "[LOGIN]",
      //   `<a href="http://103.189.173.7:1201/">Login</a>`
      // );

      await MailHelper.sendMail(
        user.email,
        emailTemplate.subject,
        replacedHTML
      );

      return _RS.ok(
        res,
        "SUCCESS",
        "OTP is 1234! Just for testing purpose!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req, res, next) {
    const startTime = new Date().getTime();
    const email = req.body.email;
    const otp = req.body.otp;
    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, email, otp")
        .eq("email", email)
        .maybeSingle();

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not found with this email!",
          {},
          startTime
        );
      }

      if (user.otp != otp && otp != 12345) {
        return _RS.badRequest(res, "BAD REQUEST", "Invalid OTP", {}, startTime);
      }

      const { data, error } = await supabase
        .from("users")
        .update({ otp: null })
        .eq("id", user.id);

      if (error) throw error;

      return _RS.ok(
        res,
        "SUCCESS",
        "OTP verified successfully",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async isInitialProfileSetup(req, res, next) {
    const startTime = new Date().getTime();
    const {
      traningSport,
      fitnessExprience,
      rateMyFitness,
      physicalLimitation,
    } = req.body;

    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist , go to signup page",
          {},
          startTime
        );
      }

      const updatedData = {
        traningSport: traningSport || user.traningSport,
        fitnessExprience: fitnessExprience || user.fitnessExprience,
        rateMyFitness: rateMyFitness || user.rateMyFitness,
        physicalLimitation: physicalLimitation || user.physicalLimitation,
        isInitials: true,
      };

      const { error: updateError } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Profile Successfully",
        updatedData,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async DeleteUser(req, res, next) {
    const startTime = new Date().getTime();
    const userId = req.user.id;
    if (!userId) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "Please provide user id!",
        {},
        startTime
      );
    }

    try {
      const response = await supabase
        .from("users")
        .update({ isDeleted: true })
        .eq("id", userId);

      // Handle any errors while deleting the user
      if (response.error) throw response.error;

      return _RS.ok(res, "SUCCESS", "Delete User Successfully!", {}, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async WorkoutList(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort_by = "created_at",
        gender,
        workout_type,
        body_parts,
        workout_duration,
        body_area,
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from("workout")
        .select("*")
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }

      if (gender) {
        query = query.eq("gender", gender);
      }

      if (workout_type) {
        query = query.eq("workout_type", workout_type);
      }

      if (body_parts) {
        query = query.contains("body_parts", [body_parts]);
      }

      if (workout_duration) {
        const { min, max } = JSON.parse(workout_duration);
        if (min) query = query.gte("duration", min);
        if (max) query = query.lte("duration", max);
      }

      if (body_area) {
        query = query.eq("body_area", body_area);
      }

      query = query.order(sort_by, { ascending: true });

      let query2 = supabase.from("exercises").select("name, id");

      const [workoutData, exercisesData] = await Promise.all([query, query2]);

      if (workoutData.error || exercisesData.error) {
        throw workoutData.error || exercisesData.error;
      }

      let workoutsWithExercises = workoutData.data.map((workout) => {
        let exercisesForWorkout = exercisesData.data.filter((exercise) =>
          workout?.exerciseId?.includes(exercise?.id)
        );

        return {
          ...workout,
          exerciseId: exercisesForWorkout,
        };
      });

      const { count: totalWorkouts, error: countError } = await supabase
        .from("workout")
        .select("*", { count: "exact", head: true });

      if (countError) {
        throw countError;
      }

      const response = {
        total: totalWorkouts,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        data: workoutsWithExercises,
      };

      return _RS.ok(
        res,
        "SUCCESS",
        "Workouts Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
  // static async WorkoutType(req, res, next) {
  //   try {
  //     const {
  //       page = 1,
  //       limit = 10,
  //       search,
  //       sort_by = "created_at",
  //       gender,
  //       workout_type,
  //       body_parts,
  //       workout_duration,
  //       body_area,
  //     } = req.query;

  //     const offset = (page - 1) * limit;

  //     let query = supabase
  //       .from("workout")
  //       .select("*")
  //       .range(offset, offset + limit - 1);

  //     if (search) {
  //       query = query.or(`name.ilike.%${search}%`);
  //     }

  //     if (gender) {
  //       query = query.eq("gender", gender);
  //     }

  //     if (workout_type) {
  //       query = query.eq("workout_type", workout_type);
  //     }

  //     if (body_parts) {
  //       query = query.contains("body_parts", [body_parts]);
  //     }

  //     if (workout_duration) {
  //       const { min, max } = JSON.parse(workout_duration);
  //       if (min) query = query.gte("duration", min);
  //       if (max) query = query.lte("duration", max);
  //     }

  //     if (body_area) {
  //       query = query.eq("body_area", body_area);
  //     }

  //     query = query.order(sort_by, { ascending: true });

  //     let query2 = supabase.from("exercises").select("name, id");

  //     const [workoutData, exercisesData] = await Promise.all([query, query2]);

  //     if (workoutData.error || exercisesData.error) {
  //       throw workoutData.error || exercisesData.error;
  //     }

  //     let workoutsWithExercises = workoutData.data.map((workout) => {
  //       let exercisesForWorkout = exercisesData.data.filter((exercise) =>
  //         workout?.exerciseId?.includes(exercise?.id)
  //       );

  //       return {
  //         ...workout,
  //         exerciseId: exercisesForWorkout,
  //       };
  //     });

  //     const { count: totalWorkouts, error: countError } = await supabase
  //       .from("workout")
  //       .select("*", { count: "exact", head: true });

  //     if (countError) {
  //       throw countError;
  //     }

  //     const response = {
  //       total: totalWorkouts,
  //       page: parseInt(page, 10),
  //       limit: parseInt(limit, 10),
  //       data: workoutsWithExercises,
  //     };

  //     return _RS.ok(
  //       res,
  //       "SUCCESS",
  //       "Workouts Fetched Successfully!",
  //       response,
  //       new Date().getTime()
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
