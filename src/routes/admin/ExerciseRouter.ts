import { Router } from "express";
import { ExerciseController } from "../../controllers/Admin/ExerciseController";
import Authentication from "../../Middlewares/Authnetication";

class ExerciseRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.get();
    this.post();
    this.put();
    this.delete();
  }

  public get() {
    this.router.get(
      "/lists",
      Authentication.admin,
      ExerciseController.listExercise
    );
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      ExerciseController.addExercise
    );
  }

  public put() {
    this.router.put(
      "/:exerciseId",
      Authentication.admin,
      ExerciseController.updateExercise
    );
    this.router.put(
      "/status/:exerciseId",
      Authentication.admin,
      ExerciseController.updateExerciseStatus
    );
  }
  public delete() {
    this.router.delete(
      "/:id",
      Authentication.admin,
      ExerciseController.deleteExercise
    );
  }
}

export default new ExerciseRoute().router;
