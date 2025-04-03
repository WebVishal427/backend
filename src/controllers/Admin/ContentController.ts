import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";
import { Credentials } from "aws-sdk";
import MailHelper from "../../helpers/MailHelper";

export class ContentController {
  // Function to send email after user registration

  static async UpdatePrivacyPolicy(req, res, next) {
    const startTime = new Date().getTime();

    try {
      const { id } = req.params;
      const { AboutUs, termsConditions, privacyPolicy, faq } = req.body;

      const updateData = {
        aboutUs: AboutUs,
        termsConditions,
        privacyPolicy,
        faq,
      };

      const { data, error } = await supabase
        .from("content")
        .update({ ...updateData })
        .eq("id", id);

      // Log response from Supabase
      console.log("Supabase update response:", { data, error });

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Content details successfully!",
        data,
        startTime
      );
    } catch (error) {
      console.error("Error occurred:", error); // Log the error
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

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
        "get all body parts Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}
