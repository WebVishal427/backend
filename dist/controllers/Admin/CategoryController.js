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
exports.CategoryController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class CategoryController {
    static addCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            try {
                const { data: category, error } = yield supabase_1.supabase
                    .from("category")
                    .insert({ name });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workout category added successfully", category, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static listCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                let query = supabase_1.supabase
                    .from("category")
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
                return ResponseHelper_1.default.ok(res, "SUCCESS", "get all workout categories Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { categoryId } = req.params;
                const { name, isActive } = req.body;
                if (!categoryId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id for updating!", {}, startTime);
                }
                const updateData = {
                    name,
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("category")
                    .update(Object.assign({}, updateData))
                    .eq("id", categoryId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update Workout category successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateCategoryStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { categoryId } = req.params;
                const { isActive } = req.body;
                if (!categoryId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide category id for updating!", {}, startTime);
                }
                else {
                    const updateData = {
                        isActive: isActive === undefined ? true : Boolean(isActive),
                    };
                    const { data, error } = yield supabase_1.supabase
                        .from("category")
                        .update(Object.assign({}, updateData))
                        .eq("id", categoryId)
                        .select();
                    if (error) {
                        throw error;
                    }
                    return ResponseHelper_1.default.ok(res, "SUCCESS", "Status change successfully!", data, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.params;
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                const response = yield supabase_1.supabase.from("category").delete().eq("id", id);
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Delete Workout category Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CategoryController = CategoryController;
