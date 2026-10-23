/* ==========================================================
   Cadastro de voluntário: máscaras, validação visual por campo,
   medidor de senha, alerta de erros, toast e modal de sucesso
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const alertaErros = document.getElementById("alerta-erros");
  const listaErros = document.getElementById("lista-erros");
  const alertaSucesso = document.getElementById("mensagem-sucesso");
  const forca = document.getElementById("forca-senha");
  const rotuloForca = document.getElementById("rotulo-forca");

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    cpf: document.getElementById("cpf"),
    tel: document.getElementById("tel"),
    data: document.getElementById("data"),
    cep: document.getElementById("cep"),
    cdd: document.getElementById("cdd"),
    ender: document.getElementById("ender"),
    estado: document.getElementById("estado"),
    senha: document.getElementById("senha"),
    termos: document.getElementById("termos")
  };

  const hoje = new Date();
  const hojeISO = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
  ].join("-");

  campos.data.max = hojeISO;

  /* ---------- Máscaras ---------- */
  const somenteNumeros = (v) => v.replace(/\D/g, "");

  function formatarCPF(valor) {
    return somenteNumeros(valor)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatarTelefone(valor) {
    const n = somenteNumeros(valor).slice(0, 11);

    if (n.length <= 2) return n;
    if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  }

  function formatarCEP(valor) {
    const n = somenteNumeros(valor).slice(0, 8);
    return n.length <= 5 ? n : `${n.slice(0, 5)}-${n.slice(5)}`;
  }

  /* ---------- Regras de validação (retornam "" se válido) ---------- */
  function validarCPF(valor) {
    const n = somenteNumeros(valor);

    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

    for (const tamanho of [9, 10]) {
      let soma = 0;

      for (let i = 0; i < tamanho; i++) {
        soma += Number(n[i]) * (tamanho + 1 - i);
      }

      let digito = (soma * 10) % 11;
      if (digito === 10) digito = 0;
      if (digito !== Number(n[tamanho])) return false;
    }

    return true;
  }

  const regras = {
    nome: (v) =>
      v.trim().length >= 3 ? "" : "Informe seu nome completo (mínimo 3 letras).",

    email: (v) => {
      if (!v.trim()) return "Informe seu e-mail.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Digite um e-mail válido, como nome@email.com.";
    },

    cpf: (v) => {
      const n = somenteNumeros(v);
      if (!n) return "Informe seu CPF.";
      if (n.length !== 11) return "O CPF deve conter 11 dígitos.";
      return validarCPF(n) ? "" : "Digite um CPF válido.";
    },

    tel: (v) => {
      const n = somenteNumeros(v);
      if (!n) return "Informe seu telefone.";
      return [10, 11].includes(n.length) ? "" : "Digite o telefone com DDD.";
    },

    data: (v) => {
      if (!v) return "Informe sua data de nascimento.";
      if (v > hojeISO) return "A data de nascimento não pode ser futura.";
      return v < "1900-01-01" ? "Digite uma data válida." : "";
    },

    cep: (v) => {
      const n = somenteNumeros(v);
      if (!n) return "Informe seu CEP.";
      return n.length === 8 ? "" : "O CEP deve conter 8 dígitos.";
    },

    cdd: (v) => (v.trim().length >= 2 ? "" : "Informe sua cidade."),
    ender: (v) => (v.trim().length >= 5 ? "" : "Informe rua, número e complemento."),
    estado: (v) => (v ? "" : "Selecione seu estado."),

    senha: (v) => {
      if (!v) return "Crie uma senha.";
      return v.length >= 8 ? "" : "A senha deve ter no mínimo 8 caracteres.";
    },

    termos: () => (campos.termos.checked ? "" : "É necessário aceitar os termos para continuar.")
  };

  const rotulos = {
    nome: "Nome completo",
    email: "E-mail",
    cpf: "CPF",
    tel: "Telefone",
    data: "Data de nascimento",
    cep: "CEP",
    cdd: "Cidade",
    ender: "Endereço",
    estado: "Estado",
    senha: "Senha",
    termos: "Termos de uso"
  };

  /* ---------- Aplicar estado visual ---------- */
  function pintar(chave, mostrarValido = true) {
    const input = campos[chave];
    const envolucro = input.closest(".campo") || input.closest(".termos");
    const msg = envolucro.querySelector(".campo__msg");
    const erro = regras[chave](input.type === "checkbox" ? "" : input.value);

    envolucro.classList.toggle("invalido", Boolean(erro));
    envolucro.classList.toggle("valido", !erro && mostrarValido);
    input.setAttribute("aria-invalid", String(Boolean(erro)));

    if (msg) {
      if (erro) {
        msg.textContent = erro;
      } else {
        msg.textContent = mostrarValido && msg.dataset.ok ? msg.dataset.ok : msg.dataset.ajuda || "";
      }
    }

    return erro;
  }

  /* guarda os textos de ajuda originais */
  Object.values(campos).forEach((input) => {
    const msg = (input.closest(".campo") || input.closest(".termos")).querySelector(".campo__msg");
    if (msg) msg.dataset.ajuda = msg.textContent;
  });

  const tocados = new Set();

  Object.entries(campos).forEach(([chave, input]) => {
    const evento = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";

    /* valida ao sair do campo; depois, em tempo real */
    input.addEventListener("blur", () => {
      tocados.add(chave);
      pintar(chave);
    });

    input.addEventListener(evento, () => {
      if (tocados.has(chave) || input.type === "checkbox" || input.tagName === "SELECT") {
        tocados.add(chave);
        pintar(chave);
      }
    });
  });

  campos.cpf.addEventListener("input", () => (campos.cpf.value = formatarCPF(campos.cpf.value)));
  campos.tel.addEventListener("input", () => (campos.tel.value = formatarTelefone(campos.tel.value)));
  campos.cep.addEventListener("input", () => (campos.cep.value = formatarCEP(campos.cep.value)));

  /* ---------- Medidor de força da senha ---------- */
  function calcularForca(s) {
    let pontos = 0;

    if (s.length >= 8) pontos++;
    if (/[a-z]/.test(s) && /[A-Z]/.test(s)) pontos++;
    if (/\d/.test(s)) pontos++;
    if (/[^A-Za-z0-9]/.test(s)) pontos++;

    return s ? Math.max(pontos, 1) : 0;
  }

  campos.senha.addEventListener("input", () => {
    const nivel = calcularForca(campos.senha.value);
    const nomes = ["", "Fraca", "Razoável", "Boa", "Forte"];

    forca.dataset.nivel = nivel;
    rotuloForca.textContent = nivel ? `Força da senha: ${nomes[nivel]}` : "";
  });

  /* ---------- Mostrar / ocultar senha ---------- */
  const botaoSenha = document.getElementById("alternar-senha");

  botaoSenha.addEventListener("click", () => {
    const oculta = campos.senha.type === "password";

    campos.senha.type = oculta ? "text" : "password";
    botaoSenha.textContent = oculta ? "Ocultar" : "Mostrar";
    botaoSenha.setAttribute("aria-pressed", String(oculta));
  });

  /* ---------- Envio ---------- */
  function limparEstados() {
    Object.keys(campos).forEach((chave) => {
      const input = campos[chave];
      const envolucro = input.closest(".campo") || input.closest(".termos");
      const msg = envolucro.querySelector(".campo__msg");

      envolucro.classList.remove("valido", "invalido");
      input.removeAttribute("aria-invalid");
      if (msg) msg.textContent = msg.dataset.ajuda || "";
    });

    tocados.clear();
    forca.dataset.nivel = 0;
    rotuloForca.textContent = "";
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alertaSucesso.hidden = true;

    const erros = [];

    Object.keys(campos).forEach((chave) => {
      tocados.add(chave);
      const erro = pintar(chave);
      if (erro) erros.push({ chave, erro });
    });

    if (erros.length) {
      listaErros.innerHTML = "";

      erros.forEach(({ chave, erro }) => {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href = `#${campos[chave].id}`;
        link.textContent = `${rotulos[chave]}: ${erro}`;
        link.addEventListener("click", (e) => {
          e.preventDefault();
          campos[chave].focus();
        });

        li.appendChild(link);
        listaErros.appendChild(li);
      });

      alertaErros.hidden = false;
      alertaErros.classList.remove("fechando");
      alertaErros.scrollIntoView({ behavior: "smooth", block: "center" });

      Aruana.toast({
        tipo: "erro",
        titulo: "Revise o formulário",
        mensagem: erros.length === 1 ? "Há 1 campo com problema." : `Há ${erros.length} campos com problema.`
      });

      campos[erros[0].chave].focus({ preventScroll: true });
      return;
    }

    alertaErros.hidden = true;

    const primeiroNome = campos.nome.value.trim().split(/\s+/)[0];

    alertaSucesso.querySelector("[data-nome]").textContent = primeiroNome;
    alertaSucesso.hidden = false;
    document.getElementById("modal-sucesso-nome").textContent = primeiroNome;

    Aruana.toast({
      tipo: "sucesso",
      titulo: "Cadastro validado!",
      mensagem: `Obrigado, ${primeiroNome}. Bem-vindo(a) ao Instituto Aruana.`
    });

    form.reset();
    limparEstados();
    Aruana.abrirModal("modal-sucesso");
  });

  form.addEventListener("reset", () => {
    setTimeout(limparEstados, 0);
    alertaErros.hidden = true;
  });
});
