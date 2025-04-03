export const Permissions = {
  DASHBOARD: "dashboard-management",
  CUSTOMER: "customer-management",
  CHALLENGE: "challenge-management",
  USERCHALLENGE: "user-challenge-management",
  FEED: "feed-management",
  LEADERBOARD: "leaderboard-management",
  CATEGORY: "category-management",
  ATTRIBUTE: "attribute-management",
  PRODUCT: "product-management",
  CONTENTMEDIA: "content-media-management",
  COUPON: "coupon-management",
  SUPPORT: "support-management",
  CMS: "cms-management",
  EMAIL: "email-template-management",
  ORDER: "order-management",
  CONTENT: "content-management",

  ROLE: "role-management",
  SUBADMIN: "sub-admin-management",
  REPORTS: "report-management",
};

// const checkPermission = (requiredPermissions) => {
//   return async (req, res, next) => {
//     if (req.user.type == "admin") {
//       req.filter = {};
//      next();
//     } else {
//       const permission = requiredPermissions;
//       let userPermissions = [];
//       const userId = req.user?.role_id;
//       const userRole = await Role.findById(userId);
//       if (userRole) {
//         userPermissions = userRole?.permission;
//       }

//      if (userPermissions.length) {
//         const hasPermission = userPermissions.includes(permission);

//         if (!hasPermission) {
//           return res.status(403).json({ message: "Permission denied" });
//         }
//         req.filter = {};

//         next();
//       } else {
//         return res.status(403).json({ message: "Permission denied" });
//       }
//     }
//   };
// };

// export default checkPermission;
