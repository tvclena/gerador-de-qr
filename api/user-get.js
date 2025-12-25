import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email obrigatório" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("usuarios")
    .select("email, cpf, whatsapp")
    .eq("email", email)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
