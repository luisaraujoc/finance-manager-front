const mesAtual = new Date().getMonth() + 1;
const anoAtual = new Date().getFullYear();
let categorias = [];
let movimentacoes = []; // Array para armazenar todas as movimentações
let itensExibidos = 10; // Quantidade inicial de itens exibidos

// Função para formatar a data no formato DD/MM/AAAA
function formatarData(data) {
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // Mês é base 0
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Função para popular a tabela com um limite de itens
function popularTabela(movimentacoes, limite) {
  const tabelaMovi = document.getElementById("tabelaMovimentacoes");

  if (movimentacoes.mensagem === "Sem movimentações") {
    tabelaMovi.innerHTML = `<tr><td colspan="6">${movimentacoes.mensagem}</td></tr>`;
    return;
  }

  // Limita a exibição aos primeiros "limite" itens
  const movimentacoesLimitadas = movimentacoes.slice(0, limite);

  tabelaMovi.innerHTML = movimentacoesLimitadas
    .map(
      (movimentacao, index) => `
        <tr>
          <td>${index + 1}</td> <!-- Contador incremental -->
          <td>${
            categorias.find(
              (categoria) => categoria.id === movimentacao.categoria_id
            )?.nome || "Categoria não encontrada"
          }</td>
          <td>${movimentacao.descricao}</td>
          <td>${movimentacao.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</td>
          <td>${formatarData(movimentacao.data)}</td>
          <td>
            <button class="btn btn-primary" onclick="editarMovimentacao(${
              movimentacao.id
            })">Editar</button>
            <button class="btn btn-danger" onclick="deleteMovimentacao(${
              movimentacao.id
            })">Eliminar</button>
          </td>
        </tr>
      `
    )
    .join("");
}

// Função para calcular saldo, entradas e saídas
function calcularSaldo(movimentacoes) {
  let totalEntradas = 0;
  let totalSaidas = 0;

  // Verifica se movimentacoes é um array
  if (Array.isArray(movimentacoes)) {
    movimentacoes.forEach((movimentacao) => {
      const categoria = categorias.find(
        (cat) => cat.id === movimentacao.categoria_id
      );

      if (categoria && categoria.tipo === "entrada") {
        totalEntradas += movimentacao.valor;
      } else if (categoria && categoria.tipo === "saida") {
        totalSaidas += movimentacao.valor;
      }
    });

    const saldo = totalEntradas - totalSaidas;

    // Atualizar a interface com valores formatados em BRL
    document.getElementById("balance-p").textContent = saldo.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
    document.getElementById("entradas").textContent =
      totalEntradas.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    document.getElementById("saidas").textContent = totalSaidas.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  } else {
    console.error("Movimentações não é um array:", movimentacoes);
  }
}

// Função para buscar movimentações
function buscarMovimentacoes(mes, ano) {
  fetch(`http://localhost:3000/movimentacoes/${user.id}/${mes}/${ano}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Movimentações carregadas:", data);

      // Verifica se a resposta é um array ou uma mensagem
      if (Array.isArray(data)) {
        movimentacoes = data; // Armazena todas as movimentações
        popularTabela(movimentacoes, itensExibidos); // Exibe os primeiros 10 itens
        calcularSaldo(movimentacoes); // Calcula e exibe saldo, entradas e saídas
      } else if (data.mensagem === "Sem movimentações") {
        popularTabela(data); // Exibe a mensagem na tabela
        calcularSaldo([]); // Passa um array vazio para calcular saldo
      } else {
        console.error("Resposta inesperada da API:", data);
      }
    })
    .catch((error) => console.error("Erro:", error));
}

// Função para preencher os selects de mês e ano
function preencherSelects() {
  const selectMes = document.getElementById("input-mes");
  const selectAno = document.getElementById("input-ano");

  // Preencher meses (1 a 12)
  for (let mes = 1; mes <= 12; mes++) {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = mes;
    selectMes.appendChild(option);
  }

  // Preencher anos (últimos 5 anos)
  const anoAtual = new Date().getFullYear();
  for (let ano = anoAtual; ano >= anoAtual - 5; ano--) {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;
    selectAno.appendChild(option);
  }

  // Selecionar mês e ano atuais por padrão
  selectMes.value = mesAtual;
  selectAno.value = anoAtual;
}

// Evento de submit do formulário de pesquisa
document
  .getElementById("pesquisaPorMês")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const mes = document.getElementById("input-mes").value;
    const ano = document.getElementById("input-ano").value;

    itensExibidos = 10; // Reseta o número de itens exibidos
    buscarMovimentacoes(mes, ano); // Busca as movimentações
  });

// Evento de clique no botão "Ver mais"
document.getElementById("loadMore").addEventListener("click", () => {
  window.location.href =
    "http://localhost/finance-manager-front/transacoes.html";
});

// Primeiro, busca as categorias
fetch(`http://localhost:3000/categorias/${user.id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    categorias = data;
    console.log("Categorias carregadas:", categorias);

    // Preencher os selects de mês e ano
    preencherSelects();

    // Buscar as movimentações iniciais (mês e ano atuais)
    buscarMovimentacoes(mesAtual, anoAtual);
  })
  .catch((error) => console.error("Erro:", error));

// Função para abrir o modal de edição e preencher os dados
function editarMovimentacao(id) {
  // Encontra a movimentação pelo ID
  const movimentacao = movimentacoes.find((mov) => mov.id === id);

  if (movimentacao) {
    // Preenche os campos do modal de edição
    document.getElementById("edit-id").value = movimentacao.id;
    document.getElementById("edit-valor").value = movimentacao.valor;
    document.getElementById("edit-descricao").value = movimentacao.descricao;
    document.getElementById("edit-data").value =
      movimentacao.data.split("T")[0]; // Formata a data para o input date

    // Preenche o select de categoria
    const selectCategoria = document.getElementById("edit-categoria");
    selectCategoria.innerHTML = categorias
      .map(
        (categoria) => `
          <option value="${categoria.id}" ${
          categoria.id === movimentacao.categoria_id ? "selected" : ""
        }>
            ${categoria.nome}
          </option>
        `
      )
      .join("");

    // Abre o modal de edição
    const modalEdit = new bootstrap.Modal(document.getElementById("modalEdit"));
    modalEdit.show();
  } else {
    console.error("Movimentação não encontrada.");
  }
}

// Função para excluir uma movimentação
function deleteMovimentacao(id) {
  if (confirm("Tem certeza que deseja excluir esta movimentação?")) {
    fetch(`http://localhost:3000/movimentacoes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          // Resposta sem conteúdo (204 No Content)
          console.log("Movimentação excluída com sucesso.");

          // Remove a movimentação da lista local
          movimentacoes = movimentacoes.filter((mov) => mov.id !== id);

          // Atualiza a tabela
          popularTabela(movimentacoes, itensExibidos);

          // Recalcula o saldo, entradas e saídas
          calcularSaldo(movimentacoes);

          // Exibe um toast de sucesso (opcional)
          exibirToast("Movimentação excluída com sucesso!", "success");
        } else {
          // Se a resposta não for 204, tenta analisar o JSON
          return response.json().then((data) => {
            console.log("Resposta do servidor:", data);
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir movimentação:", error);
        exibirToast("Erro ao excluir movimentação.", "danger");
      });
  }
}

// Evento de submit do formulário de edição
document.getElementById("formEdit").addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  // Obtém os dados do formulário
  const id = document.getElementById("edit-id").value;
  const valor = document.getElementById("edit-valor").value;
  const descricao = document.getElementById("edit-descricao").value;
  const categoria_id = document.getElementById("edit-categoria").value;
  const data = document.getElementById("edit-data").value;

  // Envia a requisição PUT para editar a movimentação
  fetch(`http://localhost:3000/movimentacoes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor: parseFloat(valor),
      descricao,
      categoria_id: parseInt(categoria_id),
      data,
      usuario_id: user.id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Movimentação editada:", data);

      // Atualiza a movimentação na lista local
      const index = movimentacoes.findIndex((mov) => mov.id === id);
      if (index !== -1) {
        movimentacoes[index] = data;
      }

      // Atualiza a tabela
      popularTabela(movimentacoes, itensExibidos);

      // Recalcula o saldo, entradas e saídas
      calcularSaldo(movimentacoes);

      // Fecha o modal de edição
      const modalEdit = bootstrap.Modal.getInstance(
        document.getElementById("modalEdit")
      );
      modalEdit.hide();

      // Exibe um toast de sucesso (opcional)
      exibirToast("Movimentação editada com sucesso!", "success");
    })
    .catch((error) => {
      console.error("Erro ao editar movimentação:", error);
      exibirToast("Erro ao editar movimentação.", "danger");
    });
});

// Função para exibir toasts (opcional)
function exibirToast(mensagem, tipo) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add(
    "toast",
    "align-items-center",
    "text-white",
    "bg-" + tipo,
    "border-0"
  );
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${mensagem}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Remove o toast após alguns segundos
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Função para preencher o select de categorias
function preencherCategorias() {
  const selectCategoria = document.getElementById("input-categoria");

  // Busca as categorias do usuário
  fetch(`http://localhost:3000/categorias/${user.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Limpa o select antes de preencher
      selectCategoria.innerHTML =
        "<option disabled selected>Selecione uma categoria</option>";

      // Adiciona cada categoria como uma opção
      data.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.id; // Valor enviado no formulário
        option.textContent = categoria.nome; // Texto exibido no select
        selectCategoria.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar categorias:", error);
    });
}

// Evento de clique no botão "Adicionar"
document
  .getElementById("adicionarMovimentacao")
  .addEventListener("click", () => {
    // Preenche o select de categorias antes de abrir o modal
    preencherCategorias();

    // Abre o modal de adição
    const modalAdd = new bootstrap.Modal(document.getElementById("modal"));
    modalAdd.show();
  });

// Evento de submit do formulário de adição
document.getElementById("addBud").addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  // Obtém os dados do formulário
  const valor = document.getElementById("input-valor").value;
  const descricao = document.getElementById("input-descricao").value;
  const categoria_id = document.getElementById("input-categoria").value;
  const data = document.getElementById("input-data").value;
  const usuario_id = user.id; // Usa o ID do usuário logado

  // Envia a requisição POST para adicionar a movimentação
  fetch("http://localhost:3000/movimentacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor: parseFloat(valor),
      descricao,
      categoria_id: parseInt(categoria_id),
      data,
      usuario_id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Movimentação adicionada:", data);

      // Adiciona a nova movimentação à lista local
      movimentacoes.unshift(data); // Adiciona no início do array

      // Atualiza a tabela
      popularTabela(movimentacoes, itensExibidos);

      // Recalcula o saldo, entradas e saídas
      calcularSaldo(movimentacoes);

      // Fecha o modal de adição
      const modalAdd = bootstrap.Modal.getInstance(
        document.getElementById("modal")
      );
      modalAdd.hide();

      // Exibe um toast de sucesso (opcional)
      exibirToast("Movimentação adicionada com sucesso!", "success");

      // Reseta o formulário
      document.getElementById("addBud").reset();
    })
    .catch((error) => {
      console.error("Erro ao adicionar movimentação:", error);
      exibirToast("Erro ao adicionar movimentação.", "danger");
    });
});
