import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";
import { Credentials } from "aws-sdk";
import MailHelper from "../../helpers/MailHelper";

export class EmailController {
  // Function to send email after user registration

  static async list(req, res, next) {
    try {
      const { search } = req.query;

      let query = supabase
        .from("emailTemplates")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`subject.ilike.%${search}%,name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          error.message || "An error occurred while fetching feedbacks."
        );
      }

      const response = {
        total: data?.length || 0,
        data: data || [],
      };

      return _RS.ok(
        res,
        "SUCCESS",
        "Emails Templates Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      next(error);
    }
  }

  static async listById(req, res, next) {
    try {
      const { listId } = req.params;

      let query = supabase.from("emailTemplates").select("*").eq("id", listId);

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
        "Emails Templates Fetched Successfully!",
        response,
        new Date().getTime()
      );
    } catch (error) {
      // Handle the error and pass it to the next middleware
      console.error("Error fetching feedbacks:", error); // Optional: Log the error for debugging
      next(error);
    }
  }

  static async addTemplates(req, res, next) {
    try {
      const { name, subject, content } = req.body;

      // Check if content is provided
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Get the current timestamp in ISO format
      const createdAt = new Date().toISOString(); // Convert to ISO string format

      // Insert the template content in the database
      const { data, error } = await supabase
        .from("emailTemplates")
        .insert({ name, content, subject })
        .single();

      if (error) {
        console.error("Insert error:", error);
        return res.status(500).json({ message: "Failed to add the template" });
      }

      return res.status(200).json({ message: "Template added successfully" });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async EditTemplates(req, res, next) {
    const { templateId } = req.params;
    const { name, content, subject, title } = req.body;
    try {
      // Check if content is provided
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }
      const payload = {
        name,
        content,
        subject,
        title,
      };

      // Update the template content in the database
      const { data, error } = await supabase
        .from("emailTemplates")
        .update({ ...payload })
        .eq("id", templateId);

      if (error) {
        console.log(error);
        return res.status(404).json({ message: "Template not found" });
      }
      return _RS.ok(
        res,
        "SUCCESS",
        "Update Template details successfully!",
        data,
        new Date().getTime()
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // static async sendWelcomeEmail(req, res, next) {
  //   try {
  //     // Fetch the welcome email template
  //     const { userEmail, activationLink } = req.body;

  //     const { data, error } = await supabase
  //       .from("emailTemplates")
  //       .select("content")
  //       .eq("template_name", "welcome_email")
  //       .single();

  //     if (error || !data) {
  //       throw new Error("Welcome email template not found");
  //     }

  //     // Replace the placeholder with the activation link
  //     let emailContent = data.content.replace(
  //       "{{activation_link}}",
  //       activationLink
  //     );

  //     //   await MailHelper.sendMail(
  //     //     userEmail,
  //     //     "Welcome to our platform!",
  //     //     emailContent
  //     //   );
  //   } catch (error) {
  //     console.error("Error sending welcome email:", error);
  //   }
  // }

  // static async sendForgotPassword(req, res, next) {
  //   try {
  //     // Fetch the welcome email template
  //     const { userEmail, activationLink } = req.body;

  //     const { data, error } = await supabase
  //       .from("emailTemplates")
  //       .select("content")
  //       .eq("templateName", "welcome email")
  //       .single();

  //     if (error || !data) {
  //       throw new Error("Welcome email template not found");
  //     }

  //     // Replace the placeholder with the activation link
  //     let emailContent = data.content.replace(
  //       "{{activation_link}}",
  //       activationLink
  //     );

  //     // Send the email (Assume a sendEmail function is already defined)
  //     //  await sendEmail(userEmail, "Welcome to our platform!", emailContent);

  //     console.log("Welcome email sent successfully");
  //   } catch (error) {
  //     console.error("Error sending welcome email:", error);
  //   }
  // }
}
