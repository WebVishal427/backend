import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class ExerciseController {
  static async addExercise(req, res, next) {
    try {
      const { name, image, video, description, sets, totalReps, calorieBurn } =
        req.body;
      const { data: exerciseExists, error: exerciseError } = await supabase
        .from("exercises")
        .select("*")
        .ilike("name", name);

      if (exerciseError) {
        throw exerciseError;
      }

      if (exerciseExists?.length > 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Exercise already exists",
          {},
          new Date().getTime()
        );
      }

      if (!name || name.trim().length === 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide exercise name",
          {},
          new Date().getTime()
        );
      }
      const { data: exercise, error } = await supabase
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

      return _RS.ok(
        res,
        "SUCCESS",
        "Exercise Added Successfully",
        exercise,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async listExercise(req, res, next) {
    try {
      const { search } = req.query;
      let query = supabase
        .from("exercises")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }

      const { data, error } = await query;

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
        "Exercises Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateExercise(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { exerciseId } = req.params;
      const {
        name,
        image,
        video,
        description,
        sets,
        totalReps,
        calorieBurn,
        isActive,
      } = req.body;

      if (!exerciseId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide exercise id for updating!",
          {},
          startTime
        );
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

      const { data, error } = await supabase
        .from("exercises")
        .update({ ...updateData })
        .eq("id", exerciseId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Exercise Updated Successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateExerciseStatus(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { exerciseId } = req.params;
      const { isActive } = req.body;

      if (!exerciseId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide exercise id for updating!",
          {},
          startTime
        );
      } else {
        const updateData = {
          isActive: isActive === undefined ? true : Boolean(isActive),
        };
        const { data, error } = await supabase
          .from("exercises")
          .update({ ...updateData })
          .eq("id", exerciseId)
          .select();

        if (error) {
          throw error;
        }
        return _RS.ok(
          res,
          "SUCCESS",
          "Exercise Status Updated Successfully!",
          data,
          startTime
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteExercise(req, res, next) {
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
      const response = await supabase.from("exercises").delete().eq("id", id);

      if (response.error) throw response.error;

      return _RS.ok(
        res,
        "SUCCESS",
        "Exercise Deleted Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
