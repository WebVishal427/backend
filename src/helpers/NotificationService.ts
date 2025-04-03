// import firebaseAdmin from "../helpers/Firebase";
// import _RS from "../helpers/ResponseHelper";
// import Admin from "../models/Admin";
// import Notification from "../models/Notification";
// import User from "../models/User";

// class NotificationService {

//     async sendNotificationMulti(userArray, title) {
//       try {
//         const receiver = await User.find({_id : { $in : userArray } });
//         console.log("receiver:", receiver);

//         receiver.map((receiverData) => {
//           if (receiverData && receiverData.device_token) {
//             const message = {
//               notification: {
//                 title: title,
//                 body: title,
//               },
//               token: receiverData.device_token,
//             };

//             firebaseAdmin
//               .messaging()
//               .send(message)
//               .then((response) => {
//                 console.log("Notification sent successfully : ", response);
//               })
//               .catch((error) => {
//                 console.log("Error while sending notification : ", error);
//               });
//           } else {
//             console.log("Device token not found for user:", receiverData);
//             return { error: true, message: "Device token not found for the user." };
//           }
//         })

//       } catch (error) {
//         console.log("Error while sending notification : ", error);
//         return { error: true, message: "Error while sending notification." };
//       }
//     }
//     async sendNotification(user, title) {
//     try {
//       const receiver = await User.findById(user);
//       console.log("receiver:", receiver);

//       if (receiver && receiver.device_token) {
//         const message = {
//           notification: {
//             title: title,
//             body: title,
//           },
//           token: receiver.device_token,
//         };

//         firebaseAdmin
//           .messaging()
//           .send(message)
//           .then((response) => {
//             console.log("Notification sent successfully : ", response);
//           })
//           .catch((error) => {
//             console.log("Error while sending notification : ", error);
//           });
//       } else {
//         console.log("Device token not found for user:", user);
//         return { error: true, message: "Device token not found for the user." };
//       }
//     } catch (error) {
//       console.log("Error while sending notification : ", error);
//       return { error: true, message: "Error while sending notification." };
//     }
//   }

//   async sendAdminNotification(title) {
//     try {
//       const receivers = await Admin.find();
//       console.log("Receivers:", receivers);

//       if (receivers && receivers.length > 0) {
//         for (const receiver of receivers) {
//           const data = {
//             type: title.type,
//             title: title.title,
//             message: title.message,
//             user: receiver._id,
//             allUser: true,
//           };

//           await new Notification(data).save();

//           if (receiver.device_token) {
//             const message = {
//               notification: {
//                 title: title.title,
//                 body: title.message,
//               },
//               token: receiver.device_token,
//             };

//             try {
//               const response = await firebaseAdmin.messaging().send(message);
//               console.log("Notification sent successfully: ", response);
//             } catch (error) {
//               console.log("Error while sending notification: ", error);
//             }
//           } else {
//             console.log("Device token not found for user:", receiver);
//           }
//         }
//       } else {
//         console.log("No receivers found.");
//         return { error: true, message: "No admins found." };
//       }
//     } catch (error) {
//       console.log("Error while sending notification: ", error);
//       return { error: true, message: "Error while sending notification." };
//     }
//   }

//   // async sendNotification(user, title) {
//   //   try {
//   //     const receiver = await User.findById(user);
//   //     console.log("receiver:",receiver);
//   //     if (receiver && receiver.device_token) {
//   //       const message = {
//   //         notification: {
//   //           title: title,
//   //           body: title,
//   //         },
//   //         token: receiver.device_token,
//   //       };
//   //       firebaseAdmin
//   //         .messaging()
//   //         .send(message)
//   //         .then((response) => {
//   //           console.log("Notification sent successfully : ", response);
//   //         });
//   //     }
//   //   } catch (error) {
//   //     console.log("Error while sending notification : ", error);
//   //     return error;
//   //   }
//   // }
// }

// export default new NotificationService();
