// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vdvnlvflxrcyvltzcque.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdm5sdmZseHJjeXZsdHpjcXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTY3MjIsImV4cCI6MjA1NTI3MjcyMn0.AOrk4cXU4jO1BFccWfhUUIwS4JNqyEKsT4JX-2dpjMc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
