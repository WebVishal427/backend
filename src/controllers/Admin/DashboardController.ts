import _RS from "../../helpers/ResponseHelper";
import { supabase } from "../../config/supabase";

export class DashboardController {
  static async getDashboard(req, res, next) {
    try {
      const { data: registeredUsersData, error: registeredUsersError } =
        await supabase.from("users").select("id", { count: "exact" });

      console.log(registeredUsersData);

      if (registeredUsersError) throw registeredUsersError;

      const registeredUsersCount = registeredUsersData.length;

      const { data: workoutCategoriesData, error: workoutCategoriesError } =
        await supabase.from("category").select("id", { count: "exact" });

      if (workoutCategoriesError) throw workoutCategoriesError;

      const workoutCategoriesCount = workoutCategoriesData.length;

      const { data: lastTransactions, error: lastTransactionsError } =
        await supabase
          .from("transactions")
          .select("id, amount, transaction_date, user_id")
          .order("transaction_date", { ascending: false })
          .limit(10);

      if (lastTransactionsError) throw lastTransactionsError;

      const userIds = lastTransactions?.map((txn) => txn.user_id);
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name")
        .in("id", userIds);

      if (usersError) throw usersError;

      const enrichedTransactions = lastTransactions.map((txn) => {
        const user = users.find((user) => user.id === txn.user_id);
        return { ...txn, user: user ? user.name : "Unknown" };
      });

      const { data: lastSubscriptions, error: lastSubscriptionsError } =
        await supabase
          .from("users")
          .select("id, name, subscription_start_date, subscription_end_date")
          .order("subscription_start_date", { ascending: false })
          .limit(5);

      if (lastSubscriptionsError) throw lastSubscriptionsError;

      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      const { data: expiringSubscriptions, error: expiringSubscriptionsError } =
        await supabase
          .from("users")
          .select("id, name, subscription_end_date")
          .gte("subscription_end_date", today.toISOString())
          .lte("subscription_end_date", nextMonth.toISOString())
          .order("subscription_end_date", { ascending: true })
          .limit(5);

      if (expiringSubscriptionsError) throw expiringSubscriptionsError;

      return _RS.ok(
        res,
        "SUCCESS",
        "Dashboard data fetched successfully",
        {
          registeredUsers: registeredUsersCount,
          workoutCategories: workoutCategoriesCount,
          lastTransactions: enrichedTransactions,
          lastSubscriptions,
          expiringSubscriptions,
        },
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}
