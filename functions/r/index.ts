import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {
  const slug = req.url.split("/").pop()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!data) {
    return new Response("QR inválido", { status: 404 })
  }

  await supabase
    .from("qr_codes")
    .update({ acessos: data.acessos + 1 })
    .eq("id", data.id)

  return Response.redirect(data.destino, 302)
})
