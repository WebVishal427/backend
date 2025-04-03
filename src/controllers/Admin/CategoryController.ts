import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class CategoryController {
  static async addCategory(req, res, next) {
    const { name } = req.body;

    try {
      const { data: category, error } = await supabase
        .from("category")
        .insert({ name });

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Workout category added successfully",
        category,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async listCategory(req, res, next) {
    try {
      const { search } = req.query;
      let query = supabase
        .from("category")
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
        "get all workout categories Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { categoryId } = req.params;
      const { name, isActive } = req.body;

      if (!categoryId) {
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
        isActive: isActive === undefined ? true : Boolean(isActive),
      };

      const { data, error } = await supabase
        .from("category")
        .update({ ...updateData })
        .eq("id", categoryId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Workout category successfully!",
        data,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCategoryStatus(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { categoryId } = req.params;
      const { isActive } = req.body;

      if (!categoryId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide category id for updating!",
          {},
          startTime
        );
      } else {
        const updateData = {
          isActive: isActive === undefined ? true : Boolean(isActive),
        };
        const { data, error } = await supabase
          .from("category")
          .update({ ...updateData })
          .eq("id", categoryId)
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
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
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
      const response = await supabase.from("category").delete().eq("id", id);

      if (response.error) throw response.error;

      return _RS.ok(
        res,
        "SUCCESS",
        "Delete Workout category Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
