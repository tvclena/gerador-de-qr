import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const SUPABASE_URL = "https://fcehmjmtxqmrjkuqlkay.supabase.co"
const SERVICE_ROLE_KEY = "sb_publishable_iCDWHsq6EguNauQPP49JCg_jUNcz30o"

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const slug = url.pathname.split("/").pop()

    if (!slug) {
      return new Response("Slug inválido", { status: 400 })
    }

    const supabase = createClient(
      SUPABASE_URL,
      SERVICE_ROLE_KEY
    )

    const { data, error } = await supabase
      .from("qr_codes")
      .select("destino, acessos, id")
      .eq("slug", slug)
      .single()

    if (error || !data) {
      return new Response("QR inválido", { status: 404 })
    }

    await supabase
      .from("qr_codes")
      .update({ acessos: data.acessos + 1 })
      .eq("id", data.id)

    return Response.redirect(data.destino, 302)

  } catch (err) {
    return new Response("Erro interno", { status: 500 })
  }
})
