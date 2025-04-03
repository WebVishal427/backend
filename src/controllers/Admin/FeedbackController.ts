import _RS from "../../helpers/ResponseHelper";
import Auth from "../../Utils/Auth";
import { supabase } from "../../config/supabase";
import { Credentials } from "aws-sdk";

export class FeedbackController {
  // Method to add a new customer
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

  static async FeedbackList(req, res, next) {
    try {
      const { search } = req.query;

      // Initialize the query to fetch feedbacks and join with users (via foreign key relationship)
      let query = supabase
        .from("feedbacks")
        .select("*, users(name)")
        .order("created_at", { ascending: false });

      // Check if search query is present
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      // Execute the query
      const { data, error } = await query;

      // If there's an error, throw it
      if (error) {
        throw new Error(
          error.message || "An error occurred while fetching feedbacks."
        );
      }

      // Prepare the response object
      const response = {
        total: data?.length || 0, // Ensure total is a valid number
        data: data || [],
      };

      // Return success response
      return _RS.ok(
        res,
        "SUCCESS",
        "Feedback List Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      // Handle the error and pass it to the next middleware
      console.error("Error fetching feedbacks:", error); // Optional: Log the error for debugging
      next(error);
    }
  }

  static async deleteFeedback(req, res, next) {
    const startTime = new Date().getTime();
    const { feedbackId } = req.params;

    // Validate if ID is provided in the request body
    if (!feedbackId) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "Please provide Feedback id!",
        {},
        startTime
      );
    }

    try {
      // Delete the bodyparts from the database
      const response = await supabase
        .from("feedbacks")
        .delete()
        .eq("id", feedbackId);

      // Handle any errors while deleting the bodyparts
      if (response.error) throw response.error;
      return _RS.ok(
        res,
        "SUCCESS",
        "Delete Feedback Successfully!",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
