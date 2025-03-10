// Obtém o modal pelo ID
var modal = new bootstrap.Modal(document.getElementById("modal"));

// Obtém o botão que abre o modal
var btn = document.getElementById("adicionarMovimentacao");

btn.addEventListener("click", function () {
  const title = document.getElementById("modal-title");
  title.textContent = "Adicionar Movimentação";
  modal.show();
});

const form = document.getElementById("addBud");
const btnadd = document.getElementById("btn-add");

// e.preventDefault();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = {
    valor: document.getElementById("input-valor"),
    descricao: document.getElementById("input-descricao"),
    categoria: document.getElementById("input-categoria"),
    data: document.getElementById("input-data"),
  };

  const validacao = validarCampos(inputs);

  if (validacao.status == false) {
    mostrarToast(validacao.mensagem, "warning");
    return;
  } else {
    fetch("http://localhost:3000/movimentacoes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id: user.id,
        categoria_id: inputs.categoria.value,
        valor: inputs.valor.value,
        data: inputs.data.value,
        descricao: inputs.descricao.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          mostrarToast("Movimentação cadastrada com sucesso!", "success");
          setTimeout(() => {
            window.location.reload();
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
});

function validarCampos({ valor, descricao, categoria, data }) {
  if (
    valor.value === "" ||
    descricao.value === "" ||
    categoria.value === "" ||
    data.value === ""
  ) {
    return { status: false, mensagem: "Preencha todos os campos!" };
  } else {
    return true;
  }
}

function mostrarToast(mensagem, tipo = "info") {
  const toastContainer = document.getElementById("toast-container");

  // Criando elementos do Toast
  const toast = document.createElement("div");
  toast.classList.add(
    "toast",
    "align-items-center",
    `bg-${tipo}`,
    "text-white",
    "border-0"
  );
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
  toastHeader.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "p-2"
  );

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

/* ----------------------------------------------------- */
// editar movimentação

modalEdit = document.getElementById("modalEdit");

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-editar")) {
    const tr = event.target.closest("tr"); // Pega a linha da tabela associada ao botão clicado
    const id = tr.children[0].textContent;
    const data = tr.children[1].textContent;
    const descricao = tr.children[2].textContent;
    const categoria = tr.children[3].textContent;
    const valor = tr.children[4].textContent
      .replace("R$ ", "")
      .replace(",", ".");

    // Seleciona os inputs do modal
    const inputs = {
      valor: document.getElementById("edit-valor"),
      descricao: document.getElementById("edit-descricao"),
      categoria: document.getElementById("edit-categoria"),
      data: document.getElementById("edit-data"),
    };

    // Preenche os valores nos campos do modal
    inputs.valor.value = valor;
    inputs.descricao.value = descricao;
    inputs.data.value = formatarDataParaInput(data);

    listaCategorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nome;
      inputs.categoria.appendChild(option);
    });

    // Altera o título do modal para "Editar Movimentação"
    document.getElementById("modal-title").textContent = "Editar Movimentação";

    // Exibe o modal
    var modalEdit = new bootstrap.Modal(document.getElementById("modalEdit"));
    modalEdit.show();
  }
});

// Função para converter data de "dd/mm/yyyy" para "yyyy-mm-dd" (formato do input date)
function formatarDataParaInput(data) {
  const partes = data.split("/");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

const submitEdit = document.getElementById("submitEdit");

submitEdit.addEventListener("click", async function () {
  await fetch(`http://localhost:3000/movimentacoes/${movimentacao.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // valor, data, categoria_id, descricao, usuario_id
      valor: inputs.valor.value,
      data: inputs.data.value,
      categoria_id: inputs.categoria.value,
      descricao: inputs.descricao.value,
      usuario_id: user.id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        mostrarToast("Movimentação editada com sucesso!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        mostrarToast(data.message, "danger");
      }
    })
    .catch((error) => {
      console.log("Erro ao editar:", error);
      mostrarToast("Ocorreu um erro na edição!", "danger");
    });
});

// ver mais
const loadMore = document.getElementById("loadMore");
loadMore.addEventListener("click", function () {
  window.location.href =
    "http://localhost/finance-manager-front/transacoes.html";
});
