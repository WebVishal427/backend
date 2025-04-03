"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Auth_1 = require("../../Utils/Auth");
const supabase_1 = require("../../config/supabase");
class CustomerController {
    // Method to add a new customer
    //@post /api/admin/customer/add
    static add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, name, mobileNumber, countryCode } = req.body;
            const data = {
                email,
                name,
                mobileNumber,
                countryCode,
            };
            if (!email || !name || !mobileNumber || !countryCode) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "All fields are required!", {}, startTime);
            }
            try {
                //check if email already exist
                const { data: user, error: fetchError } = yield supabase_1.supabase
                    .from("users")
                    .select("email")
                    .eq("email", email)
                    .maybeSingle();
                if (fetchError)
                    throw fetchError; // Handle any errors
                if (user) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Email already exist!", {}, startTime);
                }
                const { data: mobileNumberExist, error: fetchMobileError } = yield supabase_1.supabase
                    .from("users")
                    .select("mobileNumber")
                    .eq("mobileNumber", mobileNumber)
                    .eq("countryCode", countryCode)
                    .maybeSingle();
                if (fetchMobileError)
                    throw fetchMobileError;
                if (mobileNumberExist) {
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Mobile number already exist!", {}, startTime);
                }
                const { error, data: userData } = yield supabase_1.supabase
                    .from("users")
                    .insert(Object.assign(Object.assign({}, data), { password: yield Auth_1.default.encryptPassword("123456") }))
                    .single();
                if (error)
                    throw error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "User Added Successfully!", userData, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { search, startDate, endDate, page = 1, pageSize = 10 } = req.query;
                let query = supabase_1.supabase
                    .from("users")
                    .select("*", { count: "exact" })
                    .order("created_at", { ascending: false });
                if (search) {
                    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,mobileNumber.ilike.%${search}%`);
                }
                if (startDate && endDate) {
                    query = query.gte("created_at", startDate).lte("created_at", endDate);
                }
                const offset = (page - 1) * pageSize;
                query = query.range(offset, offset + pageSize - 1);
                const { data, error, count } = yield query;
                if (error) {
                    throw error;
                }
                const formattedData = data.map((_a) => {
                    var { mobileNumber, countryCode } = _a, customer = __rest(_a, ["mobileNumber", "countryCode"]);
                    return (Object.assign(Object.assign({}, customer), { phone_number: mobileNumber, country_code: countryCode }));
                });
                const response = {
                    total: count,
                    data: formattedData,
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                };
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Get All Customers Successfully!", response, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id for updating!", {}, startTime);
                }
                const { data, error } = yield supabase_1.supabase
                    .from("users")
                    .update(Object.assign({}, formattedData))
                    .eq("id", customerId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Update customer details successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const { customerId } = req.params;
                const { isActive } = req.body;
                console.log(isActive);
                const updateData = {
                    isActive: isActive === undefined ? true : Boolean(isActive),
                };
                const { data, error } = yield supabase_1.supabase
                    .from("users")
                    .update(Object.assign({}, updateData))
                    .eq("id", customerId)
                    .select();
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Status change successfully!", data, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static view(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { customerId } = req.params;
            // Validate if ID is provided
            if (!customerId) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                // Fetch user details by ID from the database
                const { data, error } = yield supabase_1.supabase
                    .from("users")
                    .select("*")
                    .eq("id", customerId)
                    .order("created_at", { ascending: false });
                // Handle the case where the user is not found
                if (!data || data.length === 0) {
                    return ResponseHelper_1.default.notFound(res, "NOTFOUND", "User Not Found!", {}, startTime);
                }
                // Handle any errors while fetching the user
                if (error) {
                    throw error;
                }
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Get User Successfully!", { data: data[0] }, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Method to delete a customer
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { id } = req.body;
            // Validate if ID is provided in the request body
            if (!id) {
                return ResponseHelper_1.default.badRequest(res, "BAD REQUEST", "Please provide user id!", {}, startTime);
            }
            try {
                // Delete the user from the database
                const response = yield supabase_1.supabase.from("users").delete().eq("id", id);
                // Handle any errors while deleting the user
                if (response.error)
                    throw response.error;
                return ResponseHelper_1.default.ok(res, "SUCCESS", "Delete User Successfully!", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CustomerController = CustomerController;
