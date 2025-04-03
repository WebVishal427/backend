"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = require("../../controllers/Admin/CategoryController");
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
        this.router.get("/lists", Authnetication_1.default.admin, CategoryController_1.CategoryController.listCategory);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, CategoryController_1.CategoryController.addCategory);
    }
    put() {
        this.router.put("/:categoryId", Authnetication_1.default.admin, CategoryController_1.CategoryController.updateCategory);
        this.router.put("/status/:categoryId", Authnetication_1.default.admin, CategoryController_1.CategoryController.updateCategoryStatus);
    }
    delete() {
        this.router.delete("/:id", Authnetication_1.default.admin, CategoryController_1.CategoryController.deleteCategory);
    }
}
exports.default = new WorkoutRoute().router;
