document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
  
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        login();
      });
    } else {
      console.log("Elemento #login-form não encontrado.");
    }
  });

  async function login() {
    const inputs = {
      email: document.getElementById("input-email"),
      senha: document.getElementById("input-password"),
    };
  
    if (!inputs.email.value || !inputs.senha.value) {
      mostrarToast("Preencha todos os campos!", "warning");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputs.email.value,
          senha: inputs.senha.value,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        mostrarToast("Login realizado com sucesso!", "success");
        localStorage.setItem("usuario", JSON.stringify(data));
        setTimeout(() => {
          window.location.href = "http://localhost/finance-manager-front/dashboard.html";
        }, 1000);
      } else {
        mostrarToast(data.message || "Erro ao fazer login", "danger");
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      mostrarToast("Ocorreu um erro ao fazer login!", "danger");
    }
  }
  

  