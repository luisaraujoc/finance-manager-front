const mesAtual = new Date().getMonth() + 1;
const anoAtual = new Date().getFullYear();
let categorias = [];

// Função para formatar a data no formato DD/MM/AAAA
function formatarData(data) {
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // Mês é base 0
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Função para popular a tabela
function popularTabela(movimentacoes) {
  const tabelaMovi = document.getElementById("tabelaMovimentacoes");

  if (movimentacoes.mensagem === "Sem movimentações") {
    tabelaMovi.innerHTML = `<tr><td colspan="6">${movimentacoes.mensagem}</td></tr>`;
    return;
  }

  tabelaMovi.innerHTML = movimentacoes
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
          <td>${movimentacao.valor.toFixed(2)}</td>
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

    // Atualizar a interface
    document.getElementById("balance-p").textContent = saldo.toFixed(2);
    document.getElementById("entradas").textContent = totalEntradas.toFixed(2);
    document.getElementById("saidas").textContent = totalSaidas.toFixed(2);
  } else {
    console.error("Movimentações não é um array:", movimentacoes);
  }
}

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

    // Após carregar as categorias, busca as movimentações
    return fetch(
      `http://localhost:3000/movimentacoes/${user.id}/${mesAtual}/${anoAtual}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Movimentações carregadas:", data);

    // Verifica se a resposta é um array ou uma mensagem
    if (Array.isArray(data)) {
      popularTabela(data);
      calcularSaldo(data); // Calcula e exibe saldo, entradas e saídas
    } else if (data.mensagem === "Sem movimentações") {
      popularTabela(data); // Exibe a mensagem na tabela
      calcularSaldo([]); // Passa um array vazio para calcular saldo
    } else {
      console.error("Resposta inesperada da API:", data);
    }
  })
  .catch((error) => console.error("Erro:", error));
