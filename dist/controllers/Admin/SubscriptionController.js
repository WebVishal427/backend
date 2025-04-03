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
exports.SubscriptionController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
const durationHelper_1 = require("../../Utils/durationHelper");
class SubscriptionController {
    static addPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { name, price, duration, features } = req.body;
                const { data: planExists, error: planError } = yield supabase_1.supabase
                    .from("subscriptions")
                    .select("*")
                    .ilike("name", name);
                if (planError) {
                    throw planError;
                }
                if ((planExists === null || planExists === void 0 ? void 0 : planExists.length) > 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Plan already exists", {}, startTime);
                }
                const { data: plan, error } = yield supabase_1.supabase
                    .from("subscriptions")
                    .insert({
                    name,
                    price,
                    duration: (0, durationHelper_1.convertDurationToDays)(duration),
                    features,
                });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Plan added successfully", plan, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static viewPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { search } = req.query;
                let query = supabase_1.supabase
                    .from("subscriptions")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (search) {
                    query = query.or(`name.ilike.%${search}%`);
                }
                // Execute the query
                const { data, error } = yield query;
                // Handle any database retrieval errors
                if (error) {
                    throw error;
                }
                const response = {
                    total: data === null || data === void 0 ? void 0 : data.length,
                    data: data,
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "get all subscriptions plan Successfully!", response, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updatePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { id } = req.params;
                const { name, price, duration, features } = req.body;
                const payload = {
                    name,
                    price,
                    duration: (0, durationHelper_1.convertDurationToDays)(duration),
                    features,
                };
                if (!id) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide plan id!", {}, startTime);
                }
                const { data: plan, error } = yield supabase_1.supabase
                    .from("subscriptions")
                    .update(Object.assign({}, payload))
                    .eq("id", id)
                    .select("*")
                    .order("created_at", { ascending: true });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Plan updated successfully", plan, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
