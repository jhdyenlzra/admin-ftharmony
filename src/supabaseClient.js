import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mwldwdhnlnsjccefhmcf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bGR3ZGhubG5zamNjZWZobWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3NTMxMzMsImV4cCI6MjAzMjMyOTEzM30.-t7DZbCEBC7X8mDPrJK0SffqbSfhmt6Wj8e2G4e2No0";

export const supabase = createClient(supabaseUrl, supabaseKey);
