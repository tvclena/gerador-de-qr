export default function handler(req, res) {
  res.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_REST_BASE: process.env.SUPABASE_REST_BASE,
    SUPABASE_FUNCTIONS_BASE: process.env.SUPABASE_FUNCTIONS_BASE,
    SUPABASE_REDIRECT_BASE: process.env.SUPABASE_REDIRECT_BASE,
    APP_NAME: process.env.APP_NAME
  });
}
