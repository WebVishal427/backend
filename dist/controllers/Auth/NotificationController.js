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
exports.NotificationController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
const firebase_1 = require("../../config/firebase");
const notifications_1 = require("../../constants/notifications");
const admin = require("firebase-admin");
class NotificationController {
    static SendNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, new Date().getTime());
                }
                const fcmToken = yield supabase_1.supabase
                    .from("users")
                    .select("fcmToken")
                    .eq("id", userId)
                    .single();
                if (!fcmToken.data.fcmToken) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, new Date().getTime());
                }
                const message = {
                    notification: {
                        title: notifications_1.NOTIFICATION.user.signup.title,
                        body: notifications_1.NOTIFICATION.user.signup.description,
                    },
                    token: fcmToken,
                };
                firebase_1.default
                    .messaging()
                    .send(message)
                    .then((response) => {
                    console.log("Notification sent successfully:", response);
                    ResponseHelper_1.default.ok(res, "Notification sent successfully", {}, new Date().getTime(), {});
                })
                    .catch((error) => {
                    next(error);
                });
            }
            catch (error) {
                console.log("Error sending notification:", error);
            }
        });
    }
    static SendAllNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationType } = req.body;
                if (!notificationType || !notifications_1.NOTIFICATION.commonUser[notificationType]) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Invalid or missing notification type!", {}, new Date().getTime());
                }
                const { data: users, error } = yield supabase_1.supabase
                    .from("users")
                    .select("fcmToken");
                if (error) {
                    throw error;
                }
                if (!users || users.length === 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "No users found with FCM tokens!", {}, new Date().getTime());
                }
                const tokens = users
                    .map((user) => user.fcmToken)
                    .filter((token) => token);
                if (tokens.length === 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "No valid FCM tokens found!", {}, new Date().getTime());
                }
                const notificationDetails = notifications_1.NOTIFICATION.commonUser[notificationType];
                const message = {
                    notification: {
                        title: notificationDetails.title,
                        body: notificationDetails.description,
                    },
                    tokens,
                };
                firebase_1.default
                    .messaging()
                    .sendMulticast(message)
                    .then((response) => {
                    console.log("Notifications sent successfully:", response);
                    return ResponseHelper_1.default.ok(res, "SUCCESS", "Notifications sent successfully!", {
                        successCount: response.successCount,
                        failureCount: response.failureCount,
                    }, new Date().getTime());
                })
                    .catch((error) => {
                    console.error("Error sending notifications:", error);
                    next(error);
                });
            }
            catch (error) {
                console.error("Error in SendAllNotification:", error);
                next(error);
            }
        });
    }
}
exports.NotificationController = NotificationController;
