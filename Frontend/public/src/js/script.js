async function carregarPerfil() {
  try {
    const perfilRes = await fetch(
      "https://links-tales-3ns6.onrender.com/api/perfil"
    );
    const perfil = await perfilRes.json();

    document.getElementById("nome").value = perfil.name || "";
    document.getElementById("bio").value = perfil.bio || "";
    document.getElementById("footer").value = perfil.footer || "";
    document.querySelector("footer").textContent = perfil.footer || "";

    const avatarEl = document.getElementById("imagemAtual");

    if (perfil?.imageUrl) {
      avatarEl.src = perfil.imageUrl;
      avatarEl.style.display = "block";
    } else {
      avatarEl.style.display = "none";
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const linksContainer = document.getElementById("links");

   if (document.getElementById("nome")) {
    carregarPerfil();
  }

  try {
    const res = await fetch("https://links-tales-3ns6.onrender.com/api/links");
    const links = await res.json();

    linksContainer.innerHTML = "";
    links.forEach((link) => {
      const a = document.createElement("a");
      a.className = "link-item";
      a.href = link.url;
      a.textContent = link.title;
      linksContainer.appendChild(a);
    });
  } catch (err) {
    console.error("Erro ao carregar os dados:", err);
  }
});