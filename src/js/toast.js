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