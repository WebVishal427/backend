import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class ContentController {
  static async list(req, res, next) {
    try {
      const { data, error } = await supabase.from("content").select("*");

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "get all content Successfully!",
        data,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}
