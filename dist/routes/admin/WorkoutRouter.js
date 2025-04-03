"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WorkoutController_1 = require("../../controllers/Admin/WorkoutController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class WorkoutRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.put();
        this.delete();
    }
    get() {
        this.router.get("/lists", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.listWorkout);
        this.router.get("/type-list", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.listWorkoutType);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.addWorkout);
        this.router.post("/addWorkoutType", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.AddWorkoutType);
        this.router.post("/status/:workoutId", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.updateStatusWorkout);
    }
    put() {
        this.router.put("/:workoutId", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.updateWorkout);
        this.router.put("/workoutType/:workoutTypeId", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.updateWorkoutType);
    }
    delete() {
        this.router.delete("/:id", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.deleteWorkout);
        this.router.delete("/workoutType/:workoutTypeId", Authnetication_1.default.admin, WorkoutController_1.WorkoutController.deleteWorkoutType);
    }
}
exports.default = new WorkoutRoute().router;
