import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { nome, slug, destino, imagem, email } = req.body;

    if (!nome || !slug || !destino || !imagem || !email) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    /* 🔹 CONVERTE BASE64 */
    const base64 = imagem.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    const fileName = `${slug}_${Date.now()}.png`;

    /* 🔹 UPLOAD NO STORAGE */
    const { error: uploadError } = await supabase
      .storage
      .from("qr-codes")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase
      .storage
      .from("qr-codes")
      .getPublicUrl(fileName);

    /* 🔹 SALVA NO BANCO */
    const { error: dbError } = await supabase
      .from("qr_codes")
      .insert({
        nome,
        slug,
        destino,
        imagem_url: publicUrl.publicUrl,
        email,
        ativo: true,
      });

    if (dbError) throw dbError;

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar QR" });
  }
}
