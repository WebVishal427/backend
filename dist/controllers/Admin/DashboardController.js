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
exports.DashboardController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class DashboardController {
    static getDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: registeredUsersData, error: registeredUsersError } = yield supabase_1.supabase.from("users").select("id", { count: "exact" });
                console.log(registeredUsersData);
                if (registeredUsersError)
                    throw registeredUsersError;
                const registeredUsersCount = registeredUsersData.length;
                const { data: workoutCategoriesData, error: workoutCategoriesError } = yield supabase_1.supabase.from("category").select("id", { count: "exact" });
                if (workoutCategoriesError)
                    throw workoutCategoriesError;
                const workoutCategoriesCount = workoutCategoriesData.length;
                const { data: lastTransactions, error: lastTransactionsError } = yield supabase_1.supabase
                    .from("transactions")
                    .select("id, amount, transaction_date, user_id")
                    .order("transaction_date", { ascending: false })
                    .limit(10);
                if (lastTransactionsError)
                    throw lastTransactionsError;
                const userIds = lastTransactions === null || lastTransactions === void 0 ? void 0 : lastTransactions.map((txn) => txn.user_id);
                const { data: users, error: usersError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name")
                    .in("id", userIds);
                if (usersError)
                    throw usersError;
                const enrichedTransactions = lastTransactions.map((txn) => {
                    const user = users.find((user) => user.id === txn.user_id);
                    return Object.assign(Object.assign({}, txn), { user: user ? user.name : "Unknown" });
                });
                const { data: lastSubscriptions, error: lastSubscriptionsError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, subscription_start_date, subscription_end_date")
                    .order("subscription_start_date", { ascending: false })
                    .limit(5);
                if (lastSubscriptionsError)
                    throw lastSubscriptionsError;
                const today = new Date();
                const nextMonth = new Date(today);
                nextMonth.setDate(today.getDate() + 30);
                const { data: expiringSubscriptions, error: expiringSubscriptionsError } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name, subscription_end_date")
                    .gte("subscription_end_date", today.toISOString())
                    .lte("subscription_end_date", nextMonth.toISOString())
                    .order("subscription_end_date", { ascending: true })
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
exports.DashboardController = DashboardController;
