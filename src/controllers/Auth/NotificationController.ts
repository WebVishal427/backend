import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";
import firebaseAdmin from "../../config/firebase";
import { NOTIFICATION } from "../../constants/notifications";
const admin = require("firebase-admin");

export class NotificationController {
  static async SendNotification(req, res, next) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide user id!",
          {},
          new Date().getTime()
        );
      }

      const fcmToken = await supabase
        .from("users")
        .select("fcmToken")
        .eq("id", userId)
        .single();

      if (!fcmToken.data.fcmToken) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide user id!",
          {},
          new Date().getTime()
        );
      }
      const message = {
        notification: {
          title: NOTIFICATION.user.signup.title,
          body: NOTIFICATION.user.signup.description,
        },
        token: fcmToken,
      };

      firebaseAdmin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Notification sent successfully:", response);
          _RS.ok(
            res,
            "Notification sent successfully",
            {},
            new Date().getTime(),
            {}
          );
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  }

  static async SendAllNotification(req, res, next) {
    try {
      const { notificationType } = req.body;

      if (!notificationType || !NOTIFICATION.commonUser[notificationType]) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Invalid or missing notification type!",
          {},
          new Date().getTime()
        );
      }

      const { data: users, error } = await supabase
        .from("users")
        .select("fcmToken");

      if (error) {
        throw error;
      }

      if (!users || users.length === 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "No users found with FCM tokens!",
          {},
          new Date().getTime()
        );
      }
      const tokens = users
        .map((user) => user.fcmToken)
        .filter((token) => token);

      if (tokens.length === 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "No valid FCM tokens found!",
          {},
          new Date().getTime()
        );
      }

      const notificationDetails = NOTIFICATION.commonUser[notificationType];

      const message = {
        notification: {
          title: notificationDetails.title,
          body: notificationDetails.description,
        },
        tokens,
      };

      firebaseAdmin
        .messaging()
        .sendMulticast(message)
        .then((response) => {
          console.log("Notifications sent successfully:", response);
          return _RS.ok(
            res,
            "SUCCESS",
            "Notifications sent successfully!",
            {
              successCount: response.successCount,
              failureCount: response.failureCount,
            },
            new Date().getTime()
          );
        })
        .catch((error) => {
          console.error("Error sending notifications:", error);
          next(error);
        });
    } catch (error) {
      console.error("Error in SendAllNotification:", error);
      next(error);
    }
  }
}
