"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExerciseController_1 = require("../../controllers/Admin/ExerciseController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class ExerciseRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.put();
        this.delete();
    }
    get() {
        this.router.get("/lists", Authnetication_1.default.admin, ExerciseController_1.ExerciseController.listExercise);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, ExerciseController_1.ExerciseController.addExercise);
    }
    put() {
        this.router.put("/:exerciseId", Authnetication_1.default.admin, ExerciseController_1.ExerciseController.updateExercise);
        this.router.put("/status/:exerciseId", Authnetication_1.default.admin, ExerciseController_1.ExerciseController.updateExerciseStatus);
    }
    delete() {
        this.router.delete("/:id", Authnetication_1.default.admin, ExerciseController_1.ExerciseController.deleteExercise);
    }
}
exports.default = new ExerciseRoute().router;
