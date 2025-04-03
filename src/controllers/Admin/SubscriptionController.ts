import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";
import { convertDurationToDays } from "../../Utils/durationHelper";

export class SubscriptionController {
  static async addPlan(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { name, price, duration, features } = req.body;

      const { data: planExists, error: planError } = await supabase
        .from("subscriptions")
        .select("*")
        .ilike("name", name);

      if (planError) {
        throw planError;
      }

      if (planExists?.length > 0) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Plan already exists",
          {},
          startTime
        );
      }

      const { data: plan, error } = await supabase
        .from("subscriptions")
        .insert({
          name,
          price,
          duration: convertDurationToDays(duration),
          features,
        });
      if (error) {
        throw error;
      }
      return _RS.ok(res, "SUCCESS", "Plan added successfully", plan, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async viewPlans(req, res, next) {
    const startTime = new Date().getTime();
    try {
      const { search } = req.query;
      let query = supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }

      // Execute the query
      const { data, error } = await query;

      // Handle any database retrieval errors
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
        "get all subscriptions plan Successfully!",
        response,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async updatePlan(req, res, next) {
    const startTime = new Date().getTime();
    try {
      const { id } = req.params;
      const { name, price, duration, features } = req.body;

      const payload = {
        name,
        price,
        duration: convertDurationToDays(duration),
        features,
      };

      if (!id) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide plan id!",
          {},
          startTime
        );
      }

      const { data: plan, error } = await supabase
        .from("subscriptions")
        .update({ ...payload })
        .eq("id", id)
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Plan updated successfully",
        plan,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
