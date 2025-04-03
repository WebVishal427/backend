import { createClient } from '@supabase/supabase-js';
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use service role for admin access

export const supabase = createClient(supabaseUrl, supabaseKey);
