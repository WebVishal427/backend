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
exports.ExerciseController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class ExerciseController {
    static addExercise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, image, video, description, sets, totalReps, calorieBurn } = req.body;
                const { data: exerciseExists, error: exerciseError } = yield supabase_1.supabase
                    .from("exercises")
                    .select("*")
                    .ilike("name", name);
                if (exerciseError) {
                    throw exerciseError;
                }
                if ((exerciseExists === null || exerciseExists === void 0 ? void 0 : exerciseExists.length) > 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Exercise already exists", {}, new Date().getTime());
                }
                if (!name || name.trim().length === 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide exercise name", {}, new Date().getTime());
                }
                const { data: exercise, error } = yield supabase_1.supabase
                    .from("exercises")
                    .insert({
                    name,
                    image,
                    video,
                    description,
                    sets,
                    totalReps,
                    calorieBurn,
                });
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Exercise Added Successfully", exercise, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static listExercise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                let query = supabase_1.supabase
                    .from("exercises")
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
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Exercises Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateExercise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { exerciseId } = req.params;
                const { name, image, video, description, sets, totalReps, calorieBurn, isActive, } = req.body;
                if (!exerciseId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide exercise id for updating!", {}, startTime);
                }
                const updateData = {
                    name,
                    image,
                    video,
                    description,
                    sets,
                    totalReps,
                    calorieBurn,
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("exercises")
                    .update(Object.assign({}, updateData))
                    .eq("id", exerciseId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Exercise Updated Successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateExerciseStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { exerciseId } = req.params;
                const { isActive } = req.body;
                if (!exerciseId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide exercise id for updating!", {}, startTime);
                }
                else {
                    const updateData = {
                        isActive: isActive === undefined ? true : Boolean(isActive),
                    };
                    const { data, error } = yield supabase_1.supabase
                        .from("exercises")
                        .update(Object.assign({}, updateData))
                        .eq("id", exerciseId)
                        .select();
                    if (error) {
                        throw error;
                    }
                    return ResponseHelper_1.default.ok(res, "SUCCESS", "Exercise Status Updated Successfully!", data, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteExercise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.params;
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                const response = yield supabase_1.supabase.from("exercises").delete().eq("id", id);
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Exercise Deleted Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ExerciseController = ExerciseController;
