import { Router } from "express";
import { WorkoutController } from "../../controllers/Admin/WorkoutController";
import Authentication from "../../Middlewares/Authnetication";

class WorkoutRoute {
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
      WorkoutController.listWorkout
    );
    this.router.get(
      "/type-list",
      Authentication.admin,
      WorkoutController.listWorkoutType
    );
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      WorkoutController.addWorkout
    );

    this.router.post(
      "/addWorkoutType",
      Authentication.admin,
      WorkoutController.AddWorkoutType
    );

    this.router.post(
      "/status/:workoutId",
      Authentication.admin,
      WorkoutController.updateStatusWorkout
    );
  }

  public put() {
    this.router.put(
      "/:workoutId",
      Authentication.admin,
      WorkoutController.updateWorkout
    );
    this.router.put(
      "/workoutType/:workoutTypeId",
      Authentication.admin,
      WorkoutController.updateWorkoutType
    );
  }

  public delete() {
    this.router.delete(
      "/:id",
      Authentication.admin,
      WorkoutController.deleteWorkout
    );
    this.router.delete(
      "/workoutType/:workoutTypeId",
      Authentication.admin,
      WorkoutController.deleteWorkoutType
    );
  }
}

export default new WorkoutRoute().router;
