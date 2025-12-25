import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("usuarios")
      .select("email, senha")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (data.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    return res.status(200).json({
      success: true,
      email: data.email
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no login" });
  }
}
