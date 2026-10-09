document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const sucesso = document.getElementById("mensagem-sucesso");

  const menu = document.getElementById("menu");
  const botaoMenu = document.getElementById("menu-btn");

  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("tel");
  const cep = document.getElementById("cep");
  const data = document.getElementById("data");

  const nome = document.getElementById("nome");

  const hoje = new Date();

  const hojeISO = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
  ].join("-");

  data.max = hojeISO;

  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );

    botaoMenu.textContent = aberto ? "×" : "☰";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
      botaoMenu.textContent = "☰";
    });
  });

  function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
  }

  function formatarCPF(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);

    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatarTelefone(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function formatarCEP(valor) {
    const numeros = somenteNumeros(valor).slice(0, 8);

    if (numeros.length <= 5) {
      return numeros;
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  function validarCPF(valor) {
    const numeros = somenteNumeros(valor);

    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(numeros[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;

    if (digito === 10) {
      digito = 0;
    }

    if (digito !== Number(numeros[9])) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(numeros[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;

    if (digito === 10) {
      digito = 0;
    }

    return digito === Number(numeros[10]);
  }

  function atualizarValidadeCPF() {
    const numeros = somenteNumeros(cpf.value);

    if (numeros.length === 0) {
      cpf.setCustomValidity("");
    } else if (numeros.length !== 11) {
      cpf.setCustomValidity("O CPF deve conter 11 dígitos.");
    } else if (!validarCPF(numeros)) {
      cpf.setCustomValidity("Digite um CPF válido.");
    } else {
      cpf.setCustomValidity("");
    }
  }

  function atualizarValidadeTelefone() {
    const numeros = somenteNumeros(telefone.value);

    if (numeros.length === 0 || [10, 11].includes(numeros.length)) {
      telefone.setCustomValidity("");
    } else {
      telefone.setCustomValidity(
        "Digite um telefone com DDD e número válido."
      );
    }
  }

  function atualizarValidadeCEP() {
    const numeros = somenteNumeros(cep.value);

    if (numeros.length === 0 || numeros.length === 8) {
      cep.setCustomValidity("");
    } else {
      cep.setCustomValidity("O CEP deve conter 8 dígitos.");
    }
  }

  function atualizarValidadeData() {
    if (data.value && data.value > hojeISO) {
      data.setCustomValidity(
        "A data de nascimento não pode ser futura."
      );
    } else {
      data.setCustomValidity("");
    }
  }

  cpf.addEventListener("input", () => {
    cpf.value = formatarCPF(cpf.value);
    atualizarValidadeCPF();
  });

  telefone.addEventListener("input", () => {
    telefone.value = formatarTelefone(telefone.value);
    atualizarValidadeTelefone();
  });

  cep.addEventListener("input", () => {
    cep.value = formatarCEP(cep.value);
    atualizarValidadeCEP();
  });

  data.addEventListener("input", atualizarValidadeData);
  data.addEventListener("change", atualizarValidadeData);

  form.addEventListener("input", () => {
    sucesso.hidden = true;
    sucesso.textContent = "";
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    atualizarValidadeCPF();
    atualizarValidadeTelefone();
    atualizarValidadeCEP();
    atualizarValidadeData();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const primeiroNome = nome.value.trim().split(/\s+/)[0];

    sucesso.textContent =
      `Cadastro validado com sucesso, ${primeiroNome}! `;

    sucesso.hidden = false;

    form.reset();

    cpf.setCustomValidity("");
    telefone.setCustomValidity("");
    cep.setCustomValidity("");
    data.setCustomValidity("");

    sucesso.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});