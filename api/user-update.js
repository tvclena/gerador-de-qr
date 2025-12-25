import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, cpf, whatsapp } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email obrigatório" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { error } = await supabase
    .from("usuarios")
    .update({
      cpf,
      whatsapp
    })
    .eq("email", email);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
