document.addEventListener("DOMContentLoaded", () => {
  const linksMenu = document.querySelectorAll(".topo nav a");

  function atualizarMenu() {
    const hash = window.location.hash;

    linksMenu.forEach((link) => {
      if (link.getAttribute("href") === "index.html") {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }

      link.classList.toggle(
        "ativo",
        link.getAttribute("href") === "index.html"
      );
    });

    if (hash === "#casos") {
      window.location.hash = "";
    }
  }

  atualizarMenu();
  window.addEventListener("pageshow", atualizarMenu);
});