import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class FeedbackController {
  static async addFeedback(req, res, next) {
    const { title, description, userId, rating, category } = req.body;

    try {
      const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .insert({ title, description, userId, rating, category });

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "add feedback successfully",
        feedbacks,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}
