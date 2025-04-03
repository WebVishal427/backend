import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class BodyPartsController {
  static async add(req, res, next) {
    const { name, description } = req.body;

    try {
      const { data: bodyparts, error } = await supabase
        .from("bodyparts")
        .insert({ name, description });

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "body part added successfully",
        bodyparts,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { search } = req.query;
      let query = supabase
        .from("bodyparts")
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
        "get all body part Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { bodyPartId } = req.params;
      const { name, isActive } = req.body;

      if (!bodyPartId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide user id for updating!",
          {},
          startTime
        );
      }

      const updateData = {
        name,
        isActive,
      };

      const { data, error } = await supabase
        .from("bodyparts")
        .update({ ...updateData })
        .eq("id", bodyPartId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Update body part details successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { bodyPartId } = req.params;
      const { isActive } = req.body;

      if (!bodyPartId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide body part id for updating!",
          {},
          startTime
        );
      } else {
        const updateData = {
          isActive: isActive === undefined ? true : Boolean(isActive),
        };
        const { data, error } = await supabase
          .from("bodyparts")
          .update({ ...updateData })
          .eq("id", bodyPartId)
          .select();

        if (error) {
          throw error;
        }
        return _RS.ok(
          res,
          "SUCCESS",
          "status changed successfully!",
          data,
          startTime
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const startTime = new Date().getTime();
    const { id } = req.params;

    // Validate if ID is provided in the request body
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
      // Delete the bodyparts from the database
      const response = await supabase.from("bodyparts").delete().eq("id", id);

      // Handle any errors while deleting the bodyparts
      if (response.error) throw response.error;

      return _RS.ok(
        res,
        "SUCCESS",
        "Delete body part Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
