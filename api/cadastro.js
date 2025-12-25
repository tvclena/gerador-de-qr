import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, cpf, whatsapp, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    if (senha.length < 4) {
      return res.status(400).json({
        error: "A senha deve ter no mínimo 4 caracteres"
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 🔎 Verifica se email já existe
    const { data: existente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existente) {
      return res.status(409).json({
        error: "Este email já está cadastrado"
      });
    }

    // ✅ Insere usuário
    const { error } = await supabase.from("usuarios").insert({
      email,
      cpf: cpf || null,
      whatsapp: whatsapp || null,
      senha
    });

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao criar conta"
      });
    }

    return res.status(201).json({
      success: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro interno no cadastro"
    });
  }
}
