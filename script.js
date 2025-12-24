const form = document.getElementById("qrForm");
const resultado = document.getElementById("resultado");
const qrImage = document.getElementById("qrImage");
const qrUrl = document.getElementById("qrUrl");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const slug = document.getElementById("slug").value.trim();
  const destino = document.getElementById("destino").value.trim();

  if (!nome || !slug || !destino) {
    alert("Preencha todos os campos");
    return;
  }

  // 1️⃣ cadastra no Supabase
  const res = await fetch(
    "https://fcehmjmtxqmrjkuqlkay.supabase.co/functions/v1/create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, slug, destino })
    }
  );

  if (!res.ok) {
    alert("Erro ao cadastrar QR");
    return;
  }

  // 2️⃣ gera QR apontando para o redirect
  const redirectUrl =
    `https://fcehmjmtxqmrjkuqlkay.supabase.co/functions/v1/r/${slug}`;

  const qrApi =
    `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(redirectUrl)}`;

  qrImage.src = qrApi;
  qrUrl.textContent = redirectUrl;
  resultado.classList.remove("hidden");
});
