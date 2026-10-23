/* ==========================================================
   Página de projetos: filtro por categoria, contador e modal
   "Saiba mais" (preenchido com os dados do próprio card)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const botoesFiltro = document.querySelectorAll(".filtro");
  const cards = document.querySelectorAll("#grade-projetos .cartao-item");
  const contador = document.getElementById("contador-projetos");

  function filtrar(categoria) {
    let visiveis = 0;

    cards.forEach((card) => {
      const mostrar = categoria === "todos" || card.dataset.categoria === categoria;
      card.classList.toggle("oculto", !mostrar);
      if (mostrar) visiveis++;
    });

    contador.textContent =
      visiveis === 1 ? "Mostrando 1 projeto" : `Mostrando ${visiveis} projetos`;
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoesFiltro.forEach((b) => {
        const ativo = b === botao;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-pressed", String(ativo));
      });

      filtrar(botao.dataset.filtro);
    });
  });

  filtrar("todos");

  /* ---------- Modal "Saiba mais" ---------- */
  const modal = document.getElementById("modal-projeto");
  const modalTitulo = document.getElementById("modal-projeto-titulo");
  const modalImagem = document.getElementById("modal-projeto-imagem");
  const modalSelo = document.getElementById("modal-projeto-selo");
  const modalTexto = document.getElementById("modal-projeto-texto");

  document.querySelectorAll("[data-projeto-detalhes]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const card = botao.closest(".cartao");
      const img = card.querySelector("img");
      const selo = card.querySelector(".selo");

      modalTitulo.textContent = card.querySelector(".cartao__titulo").textContent;
      modalTexto.textContent = card.querySelector(".cartao__texto").textContent.trim();
      modalImagem.src = img.src;
      modalImagem.alt = img.alt;
      modalSelo.className = selo.className;
      modalSelo.textContent = selo.textContent;

      Aruana.abrirModal("modal-projeto");
    });
  });
});
