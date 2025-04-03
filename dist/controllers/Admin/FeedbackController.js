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
exports.FeedbackController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class FeedbackController {
    // Method to add a new customer
    static addFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, userId, rating, category } = req.body;
            try {
                const { data: feedbacks, error } = yield supabase_1.supabase
                    .from("feedbacks")
                    .insert({ title, description, userId, rating, category });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "add feedback successfully", feedbacks, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static FeedbackList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                // Initialize the query to fetch feedbacks and join with users (via foreign key relationship)
                let query = supabase_1.supabase
                    .from("feedbacks")
                    .select("*, users(name)")
                    .order("created_at", { ascending: false });
                // Check if search query is present
                if (search) {
                    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
                }
                // Execute the query
                const { data, error } = yield query;
                // If there's an error, throw it
                if (error) {
                    throw new Error(error.message || "An error occurred while fetching feedbacks.");
                }
                // Prepare the response object
                const response = {
                    total: (data === null || data === void 0 ? void 0 : data.length) || 0,
                    data: data || [],
                };
                // Return success response
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Feedback List Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                // Handle the error and pass it to the next middleware
                console.error("Error fetching feedbacks:", error); // Optional: Log the error for debugging
                next(error);
            }
        });
    }
    static deleteFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { feedbackId } = req.params;
            // Validate if ID is provided in the request body
            if (!feedbackId) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide Feedback id!", {}, startTime);
            }
            try {
                // Delete the bodyparts from the database
                const response = yield supabase_1.supabase
                    .from("feedbacks")
                    .delete()
                    .eq("id", feedbackId);
                // Handle any errors while deleting the bodyparts
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Delete Feedback Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FeedbackController = FeedbackController;
