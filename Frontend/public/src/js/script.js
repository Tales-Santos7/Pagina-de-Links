document.addEventListener("DOMContentLoaded", async () => {
  const linksContainer = document.getElementById("links");
  const avatar = document.querySelector(".avatar img");

  try {
    const perfilRes = await fetch("/api/perfil");
    const perfil = await perfilRes.json();
    if (perfil?.imageUrl) {
      avatar.src = perfil.imageUrl;
    }

    const res = await fetch("/api/links");
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