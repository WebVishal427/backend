import _RS from "../../helpers/ResponseHelper";
import Auth from "../../Utils/Auth";
import { supabase } from "../../config/supabase";

export class CustomerController {
  // Method to add a new customer

  //@post /api/admin/customer/add
  static async add(req, res, next) {
    const startTime = new Date().getTime();
    const { email, name, mobileNumber, countryCode } = req.body;

    const data = {
      email,
      name,
      mobileNumber,
      countryCode,
    };

    if (!email || !name || !mobileNumber || !countryCode) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "All fields are required!",
        {},
        startTime
      );
    }

    try {
      //check if email already exist
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError; // Handle any errors

      if (user) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Email already exist!",
          {},
          startTime
        );
      }

      const { data: mobileNumberExist, error: fetchMobileError } =
        await supabase
          .from("users")
          .select("mobileNumber")
          .eq("mobileNumber", mobileNumber)
          .eq("countryCode", countryCode)
          .maybeSingle();

      if (fetchMobileError) throw fetchMobileError;

      if (mobileNumberExist) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Mobile number already exist!",
          {},
          startTime
        );
      }

      const { error, data: userData } = await supabase
        .from("users")
        .insert({
          ...data,
          password: await Auth.encryptPassword("123456"),
        })
        .single();

      if (error) throw error;

      return _RS.ok(
        res,
        "SUCCESS",
        "User Added Successfully!",
        userData,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    const startTime = new Date().getTime();
    try {
      const { search, startDate, endDate, page = 1, pageSize = 10 } = req.query;

      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,mobileNumber.ilike.%${search}%`
        );
      }
      if (startDate && endDate) {
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }

      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const formattedData = data.map(
        ({ mobileNumber, countryCode, ...customer }) => ({
          ...customer,
          phone_number: mobileNumber,
          country_code: countryCode,
        })
      );
      const response = {
        total: count,
        data: formattedData,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      };

      return _RS.ok(
        res,
        "SUCCESS",
        "Get All Customers Successfully!",
        response,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const startTime = new Date().getTime();
    try {
      const { customerId } = req.params;
      const { email, name, mobile_number, country_code } = req.body;

      const formattedData = {
        email,
        name,
        mobileNumber: mobile_number,
        countryCode: country_code,
      };

      if (!customerId) {
        return _RS.badRequest(
          res,
          "BAD REQUEST",
          "Please provide user id for updating!",
          {},
          startTime
        );
      }

      const { data, error } = await supabase
        .from("users")
        .update({ ...formattedData })
        .eq("id", customerId)
        .select();

      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Update customer details successfully!",
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
      const { customerId } = req.params;
      const { isActive } = req.body;

      console.log(isActive);

      const updateData = {
        isActive: isActive === undefined ? true : Boolean(isActive),
      };

      const { data, error } = await supabase
        .from("users")
        .update({ ...updateData })
        .eq("id", customerId)
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

  static async view(req, res, next) {
    const startTime = new Date().getTime();
    const { customerId } = req.params;

    // Validate if ID is provided
    if (!customerId) {
      return _RS.badRequest(
        res,
        "BAD REQUEST",
        "Please provide user id!",
        {},
        startTime
      );
    }

    try {
      // Fetch user details by ID from the database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", customerId)
        .order("created_at", { ascending: false });

      // Handle the case where the user is not found
      if (!data || data.length === 0) {
        return _RS.notFound(res, "NOTFOUND", "User Not Found!", {}, startTime);
      }

      // Handle any errors while fetching the user
      if (error) {
        throw error;
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Get User Successfully!",
        { data: data[0] },
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  // Method to delete a customer
  static async delete(req, res, next) {
    const startTime = new Date().getTime();
    const { id } = req.body;

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
      // Delete the user from the database
      const response = await supabase.from("users").delete().eq("id", id);

      // Handle any errors while deleting the user
      if (response.error) throw response.error;

      return _RS.ok(res, "SUCCESS", "Delete User Successfully!", {}, startTime);
    } catch (error) {
      next(error);
    }
  }
}
