import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";
import { body } from "express-validator";

export class WorkoutController {
  static async listWorkout(req, res, next) {
    try {
      const { search, startDate, endDate, isActive, mode } = req.query;
      let query = supabase.from("workout").select("*");

      let query2 = supabase.from("exercises").select("name, id");

      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }

      if (startDate && endDate) {
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }

      if (isActive !== undefined) {
        if (isActive === "null") {
          query = query.is("isActive", null);
        } else {
          query = query.eq("isActive", isActive === "true");
        }
      }

      if (mode) {
        query = query.eq("mode", mode);
      }

      const [workoutData, exercisesData] = await Promise.all([query, query2]);

      if (workoutData.error || exercisesData.error) {
        throw workoutData.error || exercisesData.error;
      }

      // Map exercises to workouts
      let workoutsWithExercises = workoutData.data.map((workout) => {
        let exercisesForWorkout = exercisesData.data.filter((exercise) =>
          workout?.exerciseId?.includes(exercise?.id)
        );

        return {
          ...workout,
          exerciseId: exercisesForWorkout,
        };
      });

      // Prepare response data
      const response = {
        total: workoutsWithExercises?.length,
        data: workoutsWithExercises?.reverse(),
      };

      // Send the successful response
      return _RS.ok(
        res,
        "SUCCESS",
        "Workouts Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async addWorkout(req, res, next) {
    try {
      const {
        name,
        image,
        duration,
        calorieBurn,
        sets,
        description,
        exercise,
      } = req.body;

      const { data: exerciseExists, error: exerciseError } = await supabase
        .from("workout")
        .select("*")
        .ilike("name", name);

      if (exerciseError) {
        throw exerciseError;
      }

      if (exerciseExists?.length > 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Workout name already exists",
          {},
          new Date().getTime()
        );
      }

      const { data: workout, error } = await supabase.from("workout").insert({
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

      return _RS.ok(
        res,
        "SUCCESS",
        "Workout Added Successfully",
        workout,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateWorkout(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { workoutId } = req.params;
      const {
        name,
        image,
        duration,
        calorieBurn,
        sets,
        description,
        exercise,
        isActive,
      } = req.body;

      if (!workoutId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide workout id for updating!",
          {},
          startTime
        );
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

      const { data, error } = await supabase
        .from("workout")
        .update({ ...updateData })
        .eq("id", workoutId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Workout Updated Successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusWorkout(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { workoutId } = req.params;
      const { isActive } = req.body;

      if (!workoutId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide workout id for updating!",
          {},
          startTime
        );
      }

      const updateData = {
        isActive: isActive === undefined ? true : Boolean(isActive),
      };

      const { data, error } = await supabase
        .from("workout")
        .update({ ...updateData })
        .eq("id", workoutId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Status change successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteWorkout(req, res, next) {
    const startTime = new Date().getTime();
    const { id } = req.params;

    if (!id) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "Please provide user id!",
        {},
        startTime
      );
    }

    try {
      const response = await supabase.from("workout").delete().eq("id", id);

      if (response.error) throw response.error;

      return _RS.ok(
        res,
        "SUCCESS",
        "Workout Deleted Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  // workout type controllers

  static async listWorkoutType(req, res, next) {
    try {
      const { search, startDate, endDate } = req.query;
      let query = supabase
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
      const workoutData = await query;

      if (workoutData.error) {
        throw workoutData.error;
      }

      const data = workoutData.data;
      const error = workoutData.error;

      if (error) {
        throw error;
      }

      const response = {
        total: data?.length,
        data: data,
      };

      return _RS.ok(
        res,
        "SUCCESS",
        "List Workout Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
  static async AddWorkoutType(req, res, next) {
    const { name } = req.body;

    try {
      // Validate that the workout type name is provided
      if (!name || name.trim().length === 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Workout type name is required.",
          {},
          new Date().getTime()
        );
      }

      // Check if the workout type already exists
      const { data: existingWorkoutTypes, error: fetchError } = await supabase
        .from("workouttypes")
        .select("name")
        .eq("name", name)
        .single();

      if (fetchError) {
        return next(fetchError);
      }

      if (existingWorkoutTypes) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Workout Type already exists!",
          {},
          new Date().getTime()
        );
      }

      // Insert new workout type
      const { data: category, error: insertError } = await supabase
        .from("workouttypes")
        .insert({ name })
        .single();
      if (insertError) {
        return next(insertError);
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Workout Type added successfully",
        {},
        category
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateWorkoutType(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { workoutTypeId } = req.params;
      const { name, isActive } = req.body;

      console.log({ name, isActive });

      if (!workoutTypeId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide workout Type Id  for updating!",
          {},
          startTime
        );
      }

      const updateData = {
        name,
        isActive: isActive === undefined ? true : Boolean(isActive),
      };

      const { data, error } = await supabase
        .from("workouttypes")
        .update({ ...updateData })
        .eq("id", workoutTypeId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Updated Workout Type successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteWorkoutType(req, res, next) {
    const startTime = new Date().getTime();
    const { workoutTypeId } = req.params;

    if (!workoutTypeId) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "Please provide workout Type Id!",
        {},
        startTime
      );
    }

    try {
      const response = await supabase
        .from("workouttypes")
        .delete()
        .eq("id", workoutTypeId);

      if (response.error) throw response.error;

      return _RS.ok(
        res,
        "SUCCESS",
        "Deleted Workout Type Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
