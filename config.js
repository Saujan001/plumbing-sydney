const SUPABASE_URL = 'https://zrkawewphxvskwkpsywi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpya2F3ZXdwaHh2c2t3a3BzeXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA5NDUsImV4cCI6MjA5NjQ4Njk0NX0.720XSZ7kEIVm0o0_RC6N18MwL_1YrQ-8nZ7dt6b9wLs';

const supabase = {
  url: SUPABASE_URL,
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
};
