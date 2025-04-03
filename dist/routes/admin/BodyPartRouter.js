"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BodyPartsController_1 = require("../../controllers/Admin/BodyPartsController");
const Authnetication_1 = require("../../Middlewares/Authnetication");
class BodyPartRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.get();
        this.post();
        this.put();
        this.delete();
    }
    get() {
        this.router.get("/lists", Authnetication_1.default.admin, BodyPartsController_1.BodyPartsController.list);
    }
    post() {
        this.router.post("/add", Authnetication_1.default.admin, BodyPartsController_1.BodyPartsController.add);
    }
    put() {
        this.router.put("/:bodyPartId", Authnetication_1.default.admin, BodyPartsController_1.BodyPartsController.update);
        this.router.put("/status/:bodyPartId", Authnetication_1.default.admin, BodyPartsController_1.BodyPartsController.updateStatus);
    }
    delete() {
        this.router.delete("/:id", Authnetication_1.default.admin, BodyPartsController_1.BodyPartsController.delete);
    }
}
exports.default = new BodyPartRouter().router;
