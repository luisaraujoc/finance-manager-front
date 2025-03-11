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
      (movimentacao) => `
        <tr>
          <td>${movimentacao.id}</td>
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

  // Mostra ou esconde o botão "Ver mais" com base no número de itens
  const loadMoreButton = document.getElementById("loadMore");
  if (movimentacoes.length > limite) {
    loadMoreButton.style.display = "block";
  } else {
    loadMoreButton.style.display = "none";
  }
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
    document.getElementById("balance-p").textContent = saldo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    document.getElementById("entradas").textContent = totalEntradas.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    document.getElementById("saidas").textContent = totalSaidas.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
document.getElementById("pesquisaPorMês").addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  const mes = document.getElementById("input-mes").value;
  const ano = document.getElementById("input-ano").value;

  itensExibidos = 10; // Reseta o número de itens exibidos
  buscarMovimentacoes(mes, ano); // Busca as movimentações
});

// Evento de clique no botão "Ver mais"
document.getElementById("loadMore").addEventListener("click", () => {
  itensExibidos += 10; // Aumenta o número de itens exibidos
  popularTabela(movimentacoes, itensExibidos); // Atualiza a tabela
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