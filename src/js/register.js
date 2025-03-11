 document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  } else {
    console.log("Elemento #register-form não encontrado.");
  }
});

function register() {
  const inputs = {
    nome: document.getElementById("input-Name"),
    email: document.getElementById("input-email"),
    senha: document.getElementById("input-password"),
    confirmaSenha: document.getElementById("input-confirm-password"),
  };

  const validacao = validarCampos(inputs);

  if (!validacao.status) {
    mostrarToast(validacao.mensagem, "warning");
    return;
  }

  fetch("http://localhost:3000/usuarios/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: inputs.nome.value,
      email: inputs.email.value,
      senha: inputs.senha.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        mostrarToast("Cadastro realizado com sucesso!", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        mostrarToast(data.message, "danger");
      }
    })
    .catch((error) => {
      console.log("Erro ao cadastrar:", error);
      mostrarToast("Ocorreu um erro no cadastro!", "danger");
    });
}

function validarCampos({ nome, email, senha, confirmaSenha }) {
  if (!nome.value || !email.value || !senha.value) {
    return { status: false, mensagem: "Preencha todos os campos!" };
  }

  if (senha.value !== confirmaSenha.value) {
    return { status: false, mensagem: "Senhas não conferem!" };
  }

  const regrasSenha = [
    { regex: /.{6,}/, mensagem: "A senha deve ter pelo menos 6 caracteres!" },
    { regex: /[a-z]/, mensagem: "A senha deve ter pelo menos uma letra minúscula!" },
    { regex: /[A-Z]/, mensagem: "A senha deve ter pelo menos uma letra maiúscula!" },
    { regex: /[0-9]/, mensagem: "A senha deve ter pelo menos um número!" },
    { regex: /[^a-zA-Z0-9]/, mensagem: "A senha deve ter pelo menos um caracter especial!" },
  ];

  for (const regra of regrasSenha) {
    if (!regra.regex.test(senha.value)) {
      return { status: false, mensagem: regra.mensagem };
    }
  }

  return { status: true };
}

// Nova função para exibir Toasts
function mostrarToast(mensagem, tipo = "info") {
  const toastContainer = document.getElementById("toast-container");

  // Criando elementos do Toast
  const toast = document.createElement("div");
  toast.classList.add("toast", "align-items-center", `bg-${tipo}`, "text-white", "border-0");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.setAttribute("data-bs-autohide", "true");
  toast.setAttribute("data-bs-delay", "4000"); // Exibe por 4 segundos

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.textContent = mensagem;

  // Botão de fechar o Toast
  const closeButton = document.createElement("button");
  closeButton.classList.add("btn-close", "btn-close-white", "me-2", "m-auto");
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("data-bs-dismiss", "toast");
  closeButton.setAttribute("aria-label", "Fechar");

  const toastHeader = document.createElement("div");
  toastHeader.classList.add("d-flex", "justify-content-between", "align-items-center", "p-2");

  toastHeader.appendChild(toastBody);
  toastHeader.appendChild(closeButton);
  toast.appendChild(toastHeader);

  // Adicionando ao container de toasts
  toastContainer.appendChild(toast);

  // Inicializando o Toast via Bootstrap
  const toastBootstrap = new bootstrap.Toast(toast);
  toastBootstrap.show();

  // Remover o Toast do DOM após sua exibição
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}
