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
exports.BodyPartsController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class BodyPartsController {
    static add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = req.body;
            try {
                const { data: bodyparts, error } = yield supabase_1.supabase
                    .from("bodyparts")
                    .insert({ name, description });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "body part added successfully", bodyparts, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                let query = supabase_1.supabase
                    .from("bodyparts")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (search) {
                    query = query.or(`name.ilike.%${search}%`);
                }
                const { data, error } = yield query;
                if (error) {
                    throw error;
                }
                const response = {
                    total: data === null || data === void 0 ? void 0 : data.length,
                    data: data,
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "get all body part Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { bodyPartId } = req.params;
                const { name, isActive } = req.body;
                if (!bodyPartId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id for updating!", {}, startTime);
                }
                const updateData = {
                    name,
                    isActive,
                };
                const { data, error } = yield supabase_1.supabase
                    .from("bodyparts")
                    .update(Object.assign({}, updateData))
                    .eq("id", bodyPartId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update body part details successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { bodyPartId } = req.params;
                const { isActive } = req.body;
                if (!bodyPartId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide body part id for updating!", {}, startTime);
                }
                else {
                    const updateData = {
                        isActive: isActive === undefined ? true : Boolean(isActive),
                    };
                    const { data, error } = yield supabase_1.supabase
                        .from("bodyparts")
                        .update(Object.assign({}, updateData))
                        .eq("id", bodyPartId)
                        .select();
                    if (error) {
                        throw error;
                    }
                    return ResponseHelper_1.default.ok(res, "SUCCESS", "status changed successfully!", data, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.params;
            // Validate if ID is provided in the request body
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                // Delete the bodyparts from the database
                const response = yield supabase_1.supabase.from("bodyparts").delete().eq("id", id);
                // Handle any errors while deleting the bodyparts
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Delete body part Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BodyPartsController = BodyPartsController;
