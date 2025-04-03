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
exports.ContentController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class ContentController {
    // Function to send email after user registration
    static UpdatePrivacyPolicy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { id } = req.params;
                const { AboutUs, termsConditions, privacyPolicy, faq } = req.body;
                const updateData = {
                    aboutUs: AboutUs,
                    termsConditions,
                    privacyPolicy,
                    faq,
                };
                const { data, error } = yield supabase_1.supabase
                    .from("content")
                    .update(Object.assign({}, updateData))
                    .eq("id", id);
                // Log response from Supabase
                console.log("Supabase update response:", { data, error });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update Content details successfully!", data, startTime);
            }
            catch (error) {
                console.error("Error occurred:", error); // Log the error
                next(error);
            }
        });
    }
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from("content")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) {
                    throw error;
                }
                const response = {
                    total: data === null || data === void 0 ? void 0 : data.length,
                    data: data,
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "get all body parts Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ContentController = ContentController;
