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
exports.TransactionController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class TransactionController {
    static listTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, startDate, endDate, page = 1, pageSize = 10 } = req.query;
                let query = supabase_1.supabase
                    .from("transactions")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .range((page - 1) * pageSize, page * pageSize - 1); // Apply pagination
                // Initialize an array to hold the user IDs if searching by userName
                let userIds = [];
                // Apply search if search term is provided
                if (search) {
                    // Check if the search term should be applied to transactionId (UUID)
                    query = query.or(`transactionId.ilike.%${search}%,name.ilike.%${search}%`); // Use .or to allow searching by transactionId or userName
                    // If searching by userName, filter users first
                    const { data: users, error: userError } = yield supabase_1.supabase
                        .from("users")
                        .select("id, name")
                        .ilike("name", `%${search}%`); // Search by userName
                    if (userError) {
                        throw userError;
                    }
                    // Collect user IDs based on the search result for userName
                    userIds = users.map((user) => user.id);
                    // If there are userIds from the search, filter the transactions by these userIds
                    if (userIds.length > 0) {
                        query = query.in("userId", userIds);
                    }
                }
                // Apply date range filter if startDate and endDate are provided
                if (startDate &&
                    startDate.trim() !== "" &&
                    endDate &&
                    endDate.trim() !== "") {
                    query = query.gte("created_at", startDate).lte("created_at", endDate);
                }
                const { data: transactions, error } = yield query;
                if (error) {
                    throw error;
                }
                // Get user details
                const userIdsFromTransactions = transactions.map((t) => t.userId);
                const { data: users, error: userError2 } = yield supabase_1.supabase
                    .from("users")
                    .select("id, name")
                    .in("id", userIdsFromTransactions);
                if (userError2) {
                    throw userError2;
                }
                // Get subscription details
                const subscriptionIds = transactions.map((t) => t.subscriptionId);
                const { data: subscriptions, error: subscriptionError } = yield supabase_1.supabase
                    .from("subscriptions")
                    .select("id, name")
                    .in("id", subscriptionIds);
                if (subscriptionError) {
                    throw subscriptionError;
                }
                // Merge transaction, user, and subscription details
                const transactionsWithDetails = transactions.map((transaction) => {
                    const user = users.find((u) => u.id === transaction.userId);
                    const subscription = subscriptions.find((s) => s.id === transaction.subscriptionId);
                    return Object.assign(Object.assign({}, transaction), { userName: user ? user.name : "N/A", subscriptionName: subscription ? subscription.name : "N/A" });
                });
                const response = {
                    total: transactionsWithDetails.length,
                    data: transactionsWithDetails,
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Transactions Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.params;
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                const response = yield supabase_1.supabase
                    .from("transactions")
                    .delete()
                    .eq("id", id);
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Transaction Deleted Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TransactionController = TransactionController;
