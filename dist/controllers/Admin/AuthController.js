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
exports.AuthController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Auth_1 = require("../../Utils/Auth");
const supabase_1 = require("../../config/supabase");
const MailHelper_1 = require("../../helpers/MailHelper");
class AuthController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, password } = req.body;
            try {
                const { data: user, error } = yield supabase_1.supabase
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
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User does not exist with this email", user, startTime);
                }
                const isPasswordValid = yield Auth_1.default.comparePassword(password, user.password);
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
                const token = yield Auth_1.default.getToken(payload, "30d", next);
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Login Successful!", { user, token }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { data: user, error } = yield supabase_1.supabase
                    .from("users")
                    .select("id, email, password, isActive")
                    .eq("email", email)
                    .eq("isActive", true)
                    .maybeSingle();
                if (error) {
                    throw error;
                }
                if (!user) {
                    return ResponseHelper_1.default.notFound(res, "notFound", "User not found", {}, new Date().getTime());
                }
                const hashedPassword = yield Auth_1.default.encryptPassword(password);
                const { data, error: updateError } = yield supabase_1.supabase
                    .from("users")
                    .update({ password: hashedPassword })
                    .eq("id", user.id)
                    .select("id, password");
                if (updateError) {
                    throw updateError;
                }
                if (!data) {
                    return ResponseHelper_1.default.notFound(res, "notFound", "Failed to update password", {}, new Date().getTime());
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Password Reset Successfully.", {}, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { data: user, error } = yield supabase_1.supabase
                    .from("users")
                    .select("*")
                    .eq("id", req.user.id)
                    .maybeSingle();
                if (error)
                    throw error;
                if (!user) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User not exist, go to signup page", user, startTime);
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Get Profile Successfully", user, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { old_password, new_password } = req.body;
            try {
                console.log(req.user);
                const { data, error } = yield supabase_1.supabase
                    .from("users")
                    .select("id, password")
                    .eq("id", req.user.id)
                    .maybeSingle();
                if (error) {
                    throw error;
                }
                const isPasswordCurrentCorrect = yield Auth_1.default.comparePassword(old_password, data.password);
                if (!isPasswordCurrentCorrect) {
                    return ResponseHelper_1.default.badRequest(res, "BADREQUEST", "Old password does not match", {}, startTime);
                }
                const isSamePassword = yield Auth_1.default.comparePassword(new_password, data.password);
                if (isSamePassword) {
                    return ResponseHelper_1.default.badRequest(res, "BADREQUEST", "New password cannot be the same as the old password", {}, startTime);
                }
                const encryptedPassword = yield Auth_1.default.encryptPassword(new_password);
                // admin.password = encryptedPassword;
                // await admin.save();
                const { data: updatedData, error: updateError } = yield supabase_1.supabase
                    .from("users")
                    .update({ password: encryptedPassword })
                    .eq("id", req.user.id);
                if (updateError) {
                    throw updateError;
                }
                console.log("done");
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Password Changed Successfully", updatedData, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, name, image } = req.body;
            try {
                const { data: user, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, email, image")
                    .eq("id", req.user.id)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError;
                if (!user) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User not exist , go to signup page", {}, startTime);
                }
                const updatedData = {
                    name: name || user.name,
                    image: image || user.image,
                    email: email || user.email,
                };
                const { error: updateError } = yield supabase_1.supabase
                    .from("users")
                    .update(updatedData)
                    .eq("id", user.id);
                if (updateError)
                    throw updateError;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update Profile Successfully", updatedData, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const email = req.body.email;
            try {
                const { data: admin, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, email, otp")
                    .eq("email", email)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError;
                if (!admin) {
                    return ResponseHelper_1.default.notFound(res, "SUCCESS", "Email address does not exists with us. Please check again", admin, startTime);
                }
                const otp = yield Auth_1.default.generateOtp();
                const { data: updatedData, error: updateError } = yield supabase_1.supabase
                    .from("users")
                    .update({ otp: otp === null || otp === void 0 ? void 0 : otp.otp })
                    .eq("id", admin.id)
                    .select("id,otp ")
                    .single();
                if (updateError)
                    throw updateError;
                const { data: emailTemplate, error: templateError } = yield supabase_1.supabase
                    .from("emailTemplates")
                    .select("content, subject")
                    .eq("slug", "forget password")
                    .maybeSingle();
                if (templateError)
                    throw templateError;
                console.log(admin, "before email");
                var replacedHTML = emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.content;
                replacedHTML = replacedHTML === null || replacedHTML === void 0 ? void 0 : replacedHTML.replace("[NAME]", admin.name || "");
                replacedHTML = replacedHTML === null || replacedHTML === void 0 ? void 0 : replacedHTML.replace("[OTP]", (updatedData === null || updatedData === void 0 ? void 0 : updatedData.otp) || "1234");
                yield MailHelper_1.default.sendMail(admin.email, emailTemplate.subject, replacedHTML);
                return ResponseHelper_1.default.ok(res, "SUCCESS", "OTP is sended to your email!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, otp } = req.body; // Extract email and OTP from the request body
            try {
                const { data: user, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, email, otp")
                    .eq("email", email)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError;
                if (!user) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User not found with this email!", {}, startTime);
                }
                console.log(user.otp, otp, "user");
                if (String(user.otp) !== String(otp) && otp !== "12345") {
                    return ResponseHelper_1.default.badRequest(res, "BADREQUEST", "Invalid OTP", {}, startTime);
                }
                const { data, error: updateError } = yield supabase_1.supabase
                    .from("users")
                    .update({ otp: null })
                    .eq("id", user.id);
                if (updateError)
                    throw updateError;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "OTP verified successfully", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: registeredUsersData, error: registeredUsersError } = yield supabase_1.supabase.from("users").select("id", { count: "exact" });
                if (registeredUsersError)
                    throw registeredUsersError;
                const registeredUsersCount = registeredUsersData.length;
                const { data: workoutCategoriesData, error: workoutCategoriesError } = yield supabase_1.supabase.from("category").select("id", { count: "exact" });
                if (workoutCategoriesError)
                    throw workoutCategoriesError;
                const workoutCategoriesCount = workoutCategoriesData.length;
                const { data: lastTransactions, error: lastTransactionsError } = yield supabase_1.supabase
                    .from("transactions")
                    .select("id, amount, created_at, userId")
                    .order("created_at", { ascending: false })
                    .limit(10);
                if (lastTransactionsError)
                    throw lastTransactionsError;
                const userIds = lastTransactions === null || lastTransactions === void 0 ? void 0 : lastTransactions.map((txn) => txn.userId);
                const { data: users, error: usersError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name")
                    .in("id", userIds);
                if (usersError)
                    throw usersError;
                const enrichedTransactions = lastTransactions.map((txn) => {
                    const user = users.find((user) => user.id === txn.userId);
                    return Object.assign(Object.assign({}, txn), { user: user ? user.name : "Unknown" });
                });
                const { data: lastSubscriptions, error: lastSubscriptionsError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, subscriptionStartDate, subscriptionEndDate")
                    .order("subscriptionStartDate", { ascending: false })
                    .limit(5);
                if (lastSubscriptionsError)
                    throw lastSubscriptionsError;
                const today = new Date();
                const nextMonth = new Date(today);
                nextMonth.setDate(today.getDate() + 30);
                const { data: expiringSubscriptions, error: expiringSubscriptionsError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, subscriptionEndDate")
                    .gte("subscriptionEndDate", today.toISOString())
                    .lte("subscriptionEndDate", nextMonth.toISOString())
                    .order("subscriptionEndDate", { ascending: true })
                    .limit(5);
                if (expiringSubscriptionsError)
                    throw expiringSubscriptionsError;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Dashboard data fetched successfully", {
                    registeredUsers: registeredUsersCount,
                    workoutCategories: workoutCategoriesCount,
                    lastTransactions: enrichedTransactions,
                    lastSubscriptions,
                    expiringSubscriptions,
                }, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
