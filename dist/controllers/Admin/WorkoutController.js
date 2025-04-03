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
exports.WorkoutController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const supabase_1 = require("../../config/supabase");
class WorkoutController {
    static listWorkout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, startDate, endDate, isActive, mode } = req.query;
                let query = supabase_1.supabase.from("workout").select("*");
                let query2 = supabase_1.supabase.from("exercises").select("name, id");
                if (search) {
                    query = query.or(`name.ilike.%${search}%`);
                }
                if (startDate && endDate) {
                    query = query.gte("created_at", startDate).lte("created_at", endDate);
                }
                if (isActive !== undefined) {
                    if (isActive === "null") {
                        query = query.is("isActive", null);
                    }
                    else {
                        query = query.eq("isActive", isActive === "true");
                    }
                }
                if (mode) {
                    query = query.eq("mode", mode);
                }
                const [workoutData, exercisesData] = yield Promise.all([query, query2]);
                if (workoutData.error || exercisesData.error) {
                    throw workoutData.error || exercisesData.error;
                }
                // Map exercises to workouts
                let workoutsWithExercises = workoutData.data.map((workout) => {
                    let exercisesForWorkout = exercisesData.data.filter((exercise) => { var _a; return (_a = workout === null || workout === void 0 ? void 0 : workout.exerciseId) === null || _a === void 0 ? void 0 : _a.includes(exercise === null || exercise === void 0 ? void 0 : exercise.id); });
                    return Object.assign(Object.assign({}, workout), { exerciseId: exercisesForWorkout });
                });
                // Prepare response data
                const response = {
                    total: workoutsWithExercises === null || workoutsWithExercises === void 0 ? void 0 : workoutsWithExercises.length,
                    data: workoutsWithExercises === null || workoutsWithExercises === void 0 ? void 0 : workoutsWithExercises.reverse(),
                };
                // Send the successful response
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workouts Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static addWorkout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, image, duration, calorieBurn, sets, description, exercise, } = req.body;
                const { data: exerciseExists, error: exerciseError } = yield supabase_1.supabase
                    .from("workout")
                    .select("*")
                    .ilike("name", name);
                if (exerciseError) {
                    throw exerciseError;
                }
                if ((exerciseExists === null || exerciseExists === void 0 ? void 0 : exerciseExists.length) > 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Workout name already exists", {}, new Date().getTime());
                }
                const { data: workout, error } = yield supabase_1.supabase.from("workout").insert({
                    name,
                    image,
                    duration,
                    calorieBurn,
                    sets,
                    exerciseId: exercise,
                    description,
                });
                if (error) {
                    console.log(error);
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workout Added Successfully", workout, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateWorkout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { workoutId } = req.params;
                const { name, image, duration, calorieBurn, sets, description, exercise, isActive, } = req.body;
                if (!workoutId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide workout id for updating!", {}, startTime);
                }
                const updateData = {
                    name,
                    image,
                    duration,
                    calorieBurn,
                    sets,
                    description,
                    exerciseId: exercise,
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("workout")
                    .update(Object.assign({}, updateData))
                    .eq("id", workoutId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workout Updated Successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateStatusWorkout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { workoutId } = req.params;
                const { isActive } = req.body;
                if (!workoutId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide workout id for updating!", {}, startTime);
                }
                const updateData = {
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("workout")
                    .update(Object.assign({}, updateData))
                    .eq("id", workoutId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Status change successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteWorkout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.params;
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                const response = yield supabase_1.supabase.from("workout").delete().eq("id", id);
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workout Deleted Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // workout type controllers
    static listWorkoutType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, startDate, endDate } = req.query;
                let query = supabase_1.supabase
                    .from("workouttypes")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (search) {
                    query = query.or(`name.ilike.%${search}%`);
                }
                // Filter between startDate and end_date
                if (startDate && endDate) {
                    query = query.gte("created_at", startDate).lte("created_at", endDate);
                }
                const workoutData = yield query;
                if (workoutData.error) {
                    throw workoutData.error;
                }
                const data = workoutData.data;
                const error = workoutData.error;
                if (error) {
                    throw error;
                }
                const response = {
                    total: data === null || data === void 0 ? void 0 : data.length,
                    data: data,
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "List Workout Fetched Successfully!", response, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static AddWorkoutType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            try {
                // Validate that the workout type name is provided
                if (!name || name.trim().length === 0) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Workout type name is required.", {}, new Date().getTime());
                }
                // Check if the workout type already exists
                const { data: existingWorkoutTypes, error: fetchError } = yield supabase_1.supabase
                    .from("workouttypes")
                    .select("name")
                    .eq("name", name)
                    .single();
                if (fetchError) {
                    return next(fetchError);
                }
                if (existingWorkoutTypes) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Workout Type already exists!", {}, new Date().getTime());
                }
                // Insert new workout type
                const { data: category, error: insertError } = yield supabase_1.supabase
                    .from("workouttypes")
                    .insert({ name })
                    .single();
                if (insertError) {
                    return next(insertError);
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Workout Type added successfully", {}, category);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateWorkoutType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { workoutTypeId } = req.params;
                const { name, isActive } = req.body;
                console.log({ name, isActive });
                if (!workoutTypeId) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide workout Type Id  for updating!", {}, startTime);
                }
                const updateData = {
                    name,
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("workouttypes")
                    .update(Object.assign({}, updateData))
                    .eq("id", workoutTypeId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Updated Workout Type successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteWorkoutType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { workoutTypeId } = req.params;
            if (!workoutTypeId) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide workout Type Id!", {}, startTime);
            }
            try {
                const response = yield supabase_1.supabase
                    .from("workouttypes")
                    .delete()
                    .eq("id", workoutTypeId);
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Deleted Workout Type Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.WorkoutController = WorkoutController;
