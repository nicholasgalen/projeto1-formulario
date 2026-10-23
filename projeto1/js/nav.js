/* ==========================================================
   Navegação: menu hambúrguer (mobile) + dropdown (desktop/mobile)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const botaoMenu = document.getElementById("menu-btn");
  const itensSub = document.querySelectorAll(".menu__item--sub");
  const ehDesktop = window.matchMedia("(min-width: 768px)");

  if (!menu || !botaoMenu) return;

  /* ---------- Hambúrguer ---------- */
  function definirMenu(aberto) {
    menu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    if (!aberto) fecharSubmenus();
  }

  botaoMenu.addEventListener("click", () => {
    definirMenu(!menu.classList.contains("aberto"));
  });

  /* ---------- Dropdown ---------- */
  function definirSubmenu(item, aberto) {
    const toggle = item.querySelector(".menu__toggle");
    item.classList.toggle("aberto", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
  }

  function fecharSubmenus(exceto) {
    itensSub.forEach((item) => {
      if (item !== exceto) definirSubmenu(item, false);
    });
  }

  itensSub.forEach((item) => {
    const toggle = item.querySelector(".menu__toggle");

    toggle.addEventListener("click", () => {
      const vaiAbrir = !item.classList.contains("aberto");
      fecharSubmenus(item);
      definirSubmenu(item, vaiAbrir);
    });

    /* Seta para baixo abre o submenu e foca o primeiro link */
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        definirSubmenu(item, true);
        item.querySelector(".submenu a")?.focus();
      }
    });

    /* Navegação por setas dentro do submenu */
    item.querySelector(".submenu").addEventListener("keydown", (e) => {
      const links = [...item.querySelectorAll(".submenu a")];
      const i = links.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        links[(i + 1) % links.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        links[(i - 1 + links.length) % links.length].focus();
      }
    });
  });

  /* Fechar com ESC */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    const aberto = document.querySelector(".menu__item--sub.aberto");
    if (aberto) {
      definirSubmenu(aberto, false);
      aberto.querySelector(".menu__toggle").focus();
    } else if (menu.classList.contains("aberto")) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });

  /* Fechar ao clicar fora */
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu__item--sub")) fecharSubmenus();
    if (!e.target.closest(".topo") && !ehDesktop.matches) definirMenu(false);
  });

  /* Fechar o painel mobile ao navegar */
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => definirMenu(false));
  });

  /* Ao ampliar para desktop, volta ao estado padrão */
  ehDesktop.addEventListener("change", () => definirMenu(false));
});
