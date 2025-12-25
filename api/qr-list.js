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
    const { email, page = 1, limit = 50 } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data, error, count } = await supabase
      .from("qr_codes")
      .select(
        `
        id,
        nome,
        slug,
        destino,
        imagem_url,
        acessos,
        criado_em
        `,
        { count: "exact" }
      )
      .eq("email", email)
      .eq("ativo", true)
      .order("criado_em", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total: count,
      data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar QRs" });
  }
}
