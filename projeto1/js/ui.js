/* ==========================================================
   Componentes de feedback: toasts, alertas e modais
   API global: Aruana.toast({ tipo, titulo, mensagem, duracao })
   ========================================================== */
const Aruana = (() => {
  const ICONES = { sucesso: "✓", erro: "✕", aviso: "!", info: "i" };

  function obterContainer() {
    let container = document.getElementById("toasts");

    if (!container) {
      container = document.createElement("div");
      container.id = "toasts";
      container.className = "toasts";
      document.body.appendChild(container);
    }

    return container;
  }

  function toast({ tipo = "info", titulo = "", mensagem = "", duracao = 5000 }) {
    const el = document.createElement("div");
    el.className = `toast toast--${tipo}`;
    el.setAttribute("role", tipo === "erro" ? "alert" : "status");
    el.style.setProperty("--toast-duracao", `${duracao}ms`);

    const icone = document.createElement("span");
    icone.className = "toast__icone";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = ICONES[tipo] || ICONES.info;

    const conteudo = document.createElement("div");
    conteudo.className = "toast__conteudo";

    if (titulo) {
      const t = document.createElement("strong");
      t.className = "toast__titulo";
      t.textContent = titulo;
      conteudo.appendChild(t);
    }

    if (mensagem) {
      const m = document.createElement("span");
      m.className = "toast__msg";
      m.textContent = mensagem;
      conteudo.appendChild(m);
    }

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "botao-icone";
    fechar.setAttribute("aria-label", "Fechar notificação");
    fechar.textContent = "×";

    el.append(icone, conteudo, fechar);
    obterContainer().appendChild(el);

    let temporizador;

    function remover() {
      clearTimeout(temporizador);
      el.classList.add("saindo");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }

    function iniciar() {
      temporizador = setTimeout(remover, duracao);
    }

    fechar.addEventListener("click", remover);
    el.addEventListener("mouseenter", () => clearTimeout(temporizador));
    el.addEventListener("mouseleave", iniciar);
    iniciar();

    return el;
  }

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal && typeof modal.showModal === "function") modal.showModal();
  }

  function fecharModal(modal) {
    if (modal && modal.open) modal.close();
  }

  return { toast, abrirModal, fecharModal };
})();

document.addEventListener("click", (e) => {
  /* Abrir modal: <button data-modal-abrir="id-do-modal"> */
  const abrir = e.target.closest("[data-modal-abrir]");
  if (abrir) {
    Aruana.abrirModal(abrir.dataset.modalAbrir);
    return;
  }

  /* Fechar modal: <button data-modal-fechar> */
  if (e.target.closest("[data-modal-fechar]")) {
    Aruana.fecharModal(e.target.closest("dialog"));
    return;
  }

  /* Clique no fundo escuro fecha o modal */
  if (e.target instanceof HTMLDialogElement) {
    Aruana.fecharModal(e.target);
    return;
  }

  /* Fechar alerta: <button data-alerta-fechar> */
  const fecharAlerta = e.target.closest("[data-alerta-fechar]");
  if (fecharAlerta) {
    const alerta = fecharAlerta.closest(".alerta");
    alerta.classList.add("fechando");
    setTimeout(() => (alerta.hidden = true), 300);
    return;
  }

  /* Disparar toast de demonstração: <button data-toast="sucesso"> */
  const gatilho = e.target.closest("[data-toast]");
  if (gatilho) {
    const tipo = gatilho.dataset.toast;
    const textos = {
      sucesso: ["Tudo certo!", "Sua ação foi concluída com sucesso."],
      erro: ["Algo deu errado", "Não foi possível concluir a ação. Tente novamente."],
      aviso: ["Atenção", "Revise as informações antes de continuar."],
      info: ["Você sabia?", "O Instituto Aruana protege a fauna brasileira."]
    };
    Aruana.toast({ tipo, titulo: textos[tipo][0], mensagem: textos[tipo][1] });
  }
});
