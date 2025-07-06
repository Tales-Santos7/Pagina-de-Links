document.addEventListener("DOMContentLoaded", async () => {
  const linksContainer = document.getElementById("links");

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
    console.error("Erro ao carregar os links:", err);
  }
});
