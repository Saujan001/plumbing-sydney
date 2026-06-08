/* ============ AquaFix Admin — service role client ============ */
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpya2F3ZXdwaHh2c2t3a3BzeXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkxMDk0NSwiZXhwIjoyMDk2NDg2OTQ1fQ.C9sb8OLlxNo2CBKM7gsTwXrVfrega5VAfk_TU9SOYo';

/* Use the logged-in user's JWT so RLS policies apply correctly.
   Fall back to service key only if no session exists (should not happen
   after the auth guard runs, but keeps the object safe to reference). */
const supabaseAdmin = {
  url: SUPABASE_URL,
  get headers(){
    var token = sessionStorage.getItem('adminToken') || SUPABASE_SERVICE_KEY;
    return {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }
};
