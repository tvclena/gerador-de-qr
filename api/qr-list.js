import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email não informado" });
    }

    const { data, error } = await supabase
      .from("qr_codes")
      .select("id, nome, slug, destino, imagem_url, acessos, criado_em")
      .eq("email", email)
      .eq("ativo", true)
      .order("criado_em", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar QRs" });
  }
}
