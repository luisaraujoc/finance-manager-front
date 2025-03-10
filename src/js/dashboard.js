listaCategorias = [];

// trazer categorias e ids
fetch(
  "http://localhost:3000/categorias/1" /* + localStorage.getItem("idUsuario")*/
)
  .then((response) => response.json())
  .then((data) => {
    const select = document.getElementById("input-categoria");
    data.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nome;
      select.appendChild(option);

      listaCategorias.push({
        id: categoria.id,
        nome: categoria.nome,
      });

      console.log(listaCategorias);
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar categorias:", error);
  });

// trazer movimentações
fetch(
  "http://localhost:3000/movimentacoes/1" /* + localStorage.getItem("idUsuario")*/
)
  .then((response) => response.json())
  .then((data) => {
    const table = document.getElementById("tableMovimentacoes");
    data.forEach((movimentacao) => {
      const row = table.insertRow(-1);

      categoriaNome = listaCategorias.find(
        (categoria) => categoria.id === movimentacao.categoria_id
      ).nome;

      row.innerHTML = `
                <td>${movimentacao.id}</td>
                <td>${movimentacao.valor}</td>
                <td>${movimentacao.data}</td>
                <td>${categoriaNome}</td>
                <td>${movimentacao.descricao}</td>
                <td>
                <button class="btn btn-danger" onclick="deletarMovimentacao(${movimentacao.id})">
                    Deletar
                </button>
                </td>
            `;
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar movimentações:", error);
  });

// Obtém o modal pelo ID
var modal = new bootstrap.Modal(document.getElementById("modal"));

// Obtém o botão que abre o modal
var btn = document.getElementById("adicionarMovimentacao");

// Adiciona um evento de clique no botão para abrir o modal
btn.addEventListener("click", function () {
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

  if (!validacao.status) {
    mostrarToast(validacao.mensagem, "warning");
    return;
  } else {
    fetch("http://localhost:3000/movimentacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valor: inputs.valor.value,
        data: inputs.data.value,
        categoria_id: inputs.categoria.value,
        descricao: inputs.descricao.value,
        usuario_id: localStorage.getItem("idUsuario"),
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
        console.error("Erro ao cadastrar:", error);
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
