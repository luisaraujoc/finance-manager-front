document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  } else {
    console.error("Elemento #register-form não encontrado.");
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
    mostrarAlerta(validacao.mensagem, "alert-danger");
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
        mostrarAlerta("Cadastro realizado com sucesso!", "alert-success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        mostrarAlerta(data.message, "alert-danger");
      }
    })
    .catch((error) => {
      console.error("Erro ao cadastrar:", error);
      mostrarAlerta("Ocorreu um erro no cadastro!", "alert-danger");
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
    {
      regex: /[a-z]/,
      mensagem: "A senha deve ter pelo menos uma letra minúscula!",
    },
    {
      regex: /[A-Z]/,
      mensagem: "A senha deve ter pelo menos uma letra maiúscula!",
    },
    { regex: /[0-9]/, mensagem: "A senha deve ter pelo menos um número!" },
    {
      regex: /[^a-zA-Z0-9]/,
      mensagem: "A senha deve ter pelo menos um caracter especial!",
    },
  ];

  for (const regra of regrasSenha) {
    if (!regra.regex.test(senha.value)) {
      return { status: false, mensagem: regra.mensagem };
    }
  }

  return { status: true };
}

function mostrarAlerta(mensagem, tipo) {
  const alert = document.getElementsByClassName("alert")[0];
  const alertMessage = document.getElementById("alert-message");

  alertMessage.innerText = mensagem;
  alert.classList.remove("d-none");
  alert.classList.add(tipo);
}
