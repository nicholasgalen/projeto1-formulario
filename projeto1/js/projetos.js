document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("#menu");
  const botaoMenu = document.querySelector("#menu-btn");
  const linksMenu = document.querySelectorAll(".topo nav a");

  const linkCasos = document.querySelector(
    '.topo nav a[href="#casos"]'
  );

  const linkProjetos = document.querySelector(
    '.topo nav a[href="projetos.html"]'
  );

  const botoesFiltro = document.querySelectorAll(".filtro");

  const cardsProjetos = document.querySelectorAll(
    "#grade-projetos .card[data-categoria]"
  );

  function alternarMenu() {
    const aberto = menu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(aberto));

    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );

    botaoMenu.textContent = aberto ? "×" : "☰";
  }

  botaoMenu.addEventListener("click", alternarMenu);

  linksMenu.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");

      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
      botaoMenu.textContent = "☰";
    });
  });

  function atualizarMenu() {
    const casosVisiveis = window.location.hash === "#casos";

    linkCasos.classList.toggle("ativo", casosVisiveis);
    linkProjetos.classList.toggle("ativo", !casosVisiveis);

    if (casosVisiveis) {
      linkCasos.setAttribute("aria-current", "location");
      linkProjetos.removeAttribute("aria-current");
    } else {
      linkCasos.removeAttribute("aria-current");
      linkProjetos.setAttribute("aria-current", "page");
    }
  }

  window.addEventListener("hashchange", atualizarMenu);
  window.addEventListener("pageshow", atualizarMenu);

  atualizarMenu();

  function filtrarProjetos(categoriaSelecionada) {
    cardsProjetos.forEach((card) => {
      const categoriaCard = card.dataset.categoria;

      const deveExibir =
        categoriaSelecionada === "todos" ||
        categoriaCard === categoriaSelecionada;

      card.classList.toggle("oculto", !deveExibir);
    });
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      const categoria = botao.dataset.filtro;

      botoesFiltro.forEach((outroBotao) => {
        const selecionado = outroBotao === botao;

        outroBotao.classList.toggle("ativo", selecionado);

        outroBotao.setAttribute(
          "aria-pressed",
          String(selecionado)
        );
      });

      filtrarProjetos(categoria);
    });
  });

  filtrarProjetos("todos");
});