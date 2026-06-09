/* ============ AquaFix Admin — authenticated client ============ */
const supabaseAdmin = {
  url: SUPABASE_URL,
  get headers() {
    const token = sessionStorage.getItem('adminToken');
    console.log('Auth token:', token ? token.substring(0, 40) + '...' : 'NULL');
    return {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }
};
