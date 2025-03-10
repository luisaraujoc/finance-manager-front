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
  
  function mostrarToast(mensagem, tipo = "info") {
    const toastContainer = document.getElementById("toast-container");
  
    const toast = document.createElement("div");
    toast.classList.add("toast", "align-items-center", `bg-${tipo}`, "text-white", "border-0");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.setAttribute("data-bs-autohide", "true");
    toast.setAttribute("data-bs-delay", "4000");
  
    const toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.textContent = mensagem;
  
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
    toastContainer.appendChild(toast);
  
    const toastBootstrap = new bootstrap.Toast(toast);
    toastBootstrap.show();
  
    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove();
    });
  }
  