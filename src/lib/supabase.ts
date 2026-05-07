import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://vsoealoawudijkizyddv.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI0NDg4YmU4LTQxMWItNGFhYi04YzAyLWZiNDk2NTYxZjhiYiJ9.eyJwcm9qZWN0SWQiOiJ2c29lYWxvYXd1ZGlqa2l6eWRkdiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc4MTAzODc4LCJleHAiOjIwOTM0NjM4NzgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.XZG0kwCuocCrl9wJpQxVsgr7MzA2Ijzgp-CVQot6lgg';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };