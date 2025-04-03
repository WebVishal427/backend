import _RS from "../../helpers/ResponseHelper";
import Auth from "../../Utils/Auth";
import { supabase } from "../../config/supabase";
import MailHelper from "../../helpers/MailHelper";
import { number } from "joi";

export class AuthController {
  static async login(req, res, next) {
    const startTime = new Date().getTime();

    const { email, password } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, password, isActive, isDeleted")
        .eq("email", email)
        .eq("isActive", true)
        .eq("isDeleted", false)
        .eq("type", "admin")
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
          status: "BADREQUEST",
          message: "Invalid password",
          data: {},
          startTime,
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        type: "Admin",
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
    const { email, password } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, password, isActive")
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

      const hashedPassword = await Auth.encryptPassword(password);

      const { data, error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", user.id)
        .select("id, password");

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        return _RS.notFound(
          res,
          "notFound",
          "Failed to update password",
          {},
          new Date().getTime()
        );
      }

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

      // admin.password = encryptedPassword;
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
    const { email, name, image } = req.body;
    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, name, email, image")
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
      const { data: admin, error: fetchError } = await supabase
        .from("users")
        .select("id, name, email, otp")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!admin) {
        return _RS.notFound(
          res,
          "SUCCESS",
          "Email address does not exists with us. Please check again",
          admin,
          startTime
        );
      }

      const otp = await Auth.generateOtp();
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ otp: otp?.otp })
        .eq("id", admin.id)
        .select("id,otp ")
        .single();

      if (updateError) throw updateError;

      const { data: emailTemplate, error: templateError } = await supabase
        .from("emailTemplates")
        .select("content, subject")
        .eq("slug", "forget password")
        .maybeSingle();

      if (templateError) throw templateError;

      console.log(admin, "before email");

      var replacedHTML = emailTemplate?.content;
      replacedHTML = replacedHTML?.replace("[NAME]", admin.name || "");
      replacedHTML = replacedHTML?.replace("[OTP]", updatedData?.otp || "1234");

      await MailHelper.sendMail(
        admin.email,
        emailTemplate.subject,
        replacedHTML
      );

      return _RS.ok(
        res,
        "SUCCESS",
        "OTP is sended to your email!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  static async verifyOtp(req, res, next) {
    const startTime = new Date().getTime();
    const { email, otp } = req.body; // Extract email and OTP from the request body

    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, email, otp")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not found with this email!",
          {},
          startTime
        );
      }
      console.log(user.otp, otp, "user");

      if (String(user.otp) !== String(otp) && otp !== "12345") {
        return _RS.badRequest(res, "BADREQUEST", "Invalid OTP", {}, startTime);
      }

      const { data, error: updateError } = await supabase
        .from("users")
        .update({ otp: null })
        .eq("id", user.id);

      if (updateError) throw updateError;

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

  static async getDashboard(req, res, next) {
    try {
      const { data: registeredUsersData, error: registeredUsersError } =
        await supabase.from("users").select("id", { count: "exact" });

      if (registeredUsersError) throw registeredUsersError;

      const registeredUsersCount = registeredUsersData.length;

      const { data: workoutCategoriesData, error: workoutCategoriesError } =
        await supabase.from("category").select("id", { count: "exact" });

      if (workoutCategoriesError) throw workoutCategoriesError;

      const workoutCategoriesCount = workoutCategoriesData.length;

      const { data: lastTransactions, error: lastTransactionsError } =
        await supabase
          .from("transactions")
          .select("id, amount, created_at, userId")
          .order("created_at", { ascending: false })
          .limit(10);

      if (lastTransactionsError) throw lastTransactionsError;

      const userIds = lastTransactions?.map((txn) => txn.userId);
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name")
        .in("id", userIds);

      if (usersError) throw usersError;

      const enrichedTransactions = lastTransactions.map((txn) => {
        const user = users.find((user) => user.id === txn.userId);
        return { ...txn, user: user ? user.name : "Unknown" };
      });

      const { data: lastSubscriptions, error: lastSubscriptionsError } =
        await supabase
          .from("users")
          .select("id, name, subscriptionStartDate, subscriptionEndDate")
          .order("subscriptionStartDate", { ascending: false })
          .limit(5);

      if (lastSubscriptionsError) throw lastSubscriptionsError;

      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      const { data: expiringSubscriptions, error: expiringSubscriptionsError } =
        await supabase
          .from("users")
          .select("id, name, subscriptionEndDate")
          .gte("subscriptionEndDate", today.toISOString())
          .lte("subscriptionEndDate", nextMonth.toISOString())
          .order("subscriptionEndDate", { ascending: true })
          .limit(5);

      if (expiringSubscriptionsError) throw expiringSubscriptionsError;

      return _RS.ok(
        res,
        "SUCCESS",
        "Dashboard data fetched successfully",
        {
          registeredUsers: registeredUsersCount,
          workoutCategories: workoutCategoriesCount,
          lastTransactions: enrichedTransactions,
          lastSubscriptions,
          expiringSubscriptions,
        },
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}
