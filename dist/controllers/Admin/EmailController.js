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
exports.EmailController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class EmailController {
    // Function to send email after user registration
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                let query = supabase_1.supabase
                    .from("emailTemplates")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (search) {
                    query = query.or(`subject.ilike.%${search}%,name.ilike.%${search}%`);
                }
                const { data, error } = yield query;
                if (error) {
                    throw new Error(error.message || "An error occurred while fetching feedbacks.");
                }
                const response = {
                    total: (data === null || data === void 0 ? void 0 : data.length) || 0,
                    data: data || [],
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Emails Templates Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                console.error("Error fetching feedbacks:", error);
                next(error);
            }
        });
    }
    static listById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listId } = req.params;
                let query = supabase_1.supabase.from("emailTemplates").select("*").eq("id", listId);
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
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Emails Templates Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                // Handle the error and pass it to the next middleware
                console.error("Error fetching feedbacks:", error); // Optional: Log the error for debugging
                next(error);
            }
        });
    }
    static addTemplates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, subject, content } = req.body;
                // Check if content is provided
                if (!content) {
                    return res.status(400).json({ message: "Content is required" });
                }
                // Get the current timestamp in ISO format
                const createdAt = new Date().toISOString(); // Convert to ISO string format
                // Insert the template content in the database
                const { data, error } = yield supabase_1.supabase
                    .from("emailTemplates")
                    .insert({ name, content, subject })
                    .single();
                if (error) {
                    console.error("Insert error:", error);
                    return res.status(500).json({ message: "Failed to add the template" });
                }
                return res.status(200).json({ message: "Template added successfully" });
            }
            catch (error) {
                console.error("Server error:", error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    static EditTemplates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { templateId } = req.params;
            const { name, content, subject, title } = req.body;
            try {
                // Check if content is provided
                if (!content) {
                    return res.status(400).json({ message: "Content is required" });
                }
                const payload = {
                    name,
                    content,
                    subject,
                    title,
                };
                // Update the template content in the database
                const { data, error } = yield supabase_1.supabase
                    .from("emailTemplates")
                    .update(Object.assign({}, payload))
                    .eq("id", templateId);
                if (error) {
                    console.log(error);
                    return res.status(404).json({ message: "Template not found" });
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update Template details successfully!", data, new Date().getTime());
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.EmailController = EmailController;
