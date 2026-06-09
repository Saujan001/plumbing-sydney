/* ============ AquaFix Admin — authenticated client ============ */
const supabaseAdmin = {
  url: SUPABASE_URL,
  get headers() {
    const token = sessionStorage.getItem('adminToken');
    return {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }
};
