import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { id, nome, destino, email } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    // 🔒 Garante que o QR pertence ao usuário
    const { data: qr, error: findError } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("id", id)
      .eq("email", email)
      .maybeSingle();

    if (findError) throw findError;

    if (!qr) {
      return res.status(403).json({ error: "QR não pertence a este usuário" });
    }

    // ✏️ Atualiza apenas os campos enviados
    const { error: updateError } = await supabase
      .from("qr_codes")
      .update({
        nome,
        destino
      })
      .eq("id", id);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao editar QR" });
  }
}
