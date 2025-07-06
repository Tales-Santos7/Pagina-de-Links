const form = document.getElementById("form-link");
const linksDiv = document.getElementById("links");

// Carrega todos os links da API e renderiza na tela
async function fetchLinks() {
  const res = await fetch("https://links-tales-3ns6.onrender.com/api/links");
  const links = await res.json();

  linksDiv.innerHTML = ""; // Limpa a lista antes de renderizar

  links.forEach((link) => {
    const div = document.createElement("div");
    div.className = "link-item";

    const info = document.createElement("div");
    info.className = "link-info";
    info.innerHTML = `<strong>${link.title}</strong> <br><a href="${link.url}" target="_blank">${link.url}</a>`;

    // Botão para editar o link
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️";
    btnEdit.onclick = () => {
      const confirmar = confirm("Tem certeza que deseja editar este link?");
      if (confirmar) {
        // Preenche o formulário com os dados existentes
        document.getElementById("title").value = link.title;
        document.getElementById("url").value = link.url;
        document.getElementById("linkId").value = link._id;
      }
    };

    // Botão para excluir o link
    const btnDel = document.createElement("button");
    btnDel.textContent = "🗑️";
    btnDel.onclick = async () => {
      const confirmar = confirm("Tem certeza que deseja excluir este link?");
      if (confirmar) {
        await fetch(
          `https://links-tales-3ns6.onrender.com/api/links/${link._id}`,
          { method: "DELETE" }
        );
        fetchLinks(); // Recarrega a lista após exclusão
      }
    };

    // Monta o item de link com os botões
    div.appendChild(info);
    div.appendChild(btnEdit);
    div.appendChild(btnDel);
    linksDiv.appendChild(div);
  });
}

// Lida com envio do formulário (criar ou atualizar)
form.onsubmit = async (e) => {
  e.preventDefault();

  // Obtém dados do formulário
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const id = document.getElementById("linkId").value;

  // Se existe ID, edita link existente
  if (id) {
    const confirmar = confirm("Tem certeza que deseja atualizar este link?");
    if (!confirmar) return;

    await fetch(`https://links-tales-3ns6.onrender.com/api/links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
  } else {
    // Se não existe ID, cria novo link
    await fetch("https://links-tales-3ns6.onrender.com/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
  }

  // Limpa formulário e recarrega lista
  form.reset();
  document.getElementById("linkId").value = "";
  fetchLinks();
};

// Inicializa a lista de links ao carregar a página
fetchLinks();