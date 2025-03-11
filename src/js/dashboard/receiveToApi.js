listaCategorias = [];
let categoriasMap = {};


// Buscar categorias e armazenar no mapa
fetch("http://localhost:3000/categorias/" + user.id)
  .then((response) => response.json())
  .then((data) => {
    listaCategorias = data;
    console.log("Categorias:", listaCategorias);
    

    listaCategorias.forEach((categoria) => {
      const option = document.createElement("option");
      const selectCategoria = document.getElementById("input-categoria");
      option.value = categoria.id;
      option.text = categoria.nome;
      selectCategoria.appendChild(option);

      // Criar um mapa para buscar o tipo mais rápido
      categoriasMap[categoria.id] = categoria.tipo;
    });

    // Agora que temos as categorias, buscar as movimentações
    carregarMovimentacoes();
  })
  .catch((error) => {
    console.log("Erro ao buscar categorias:", error);
  });

function carregarMovimentacoes() {
  fetch("http://localhost:3000/movimentacoes/" + user.id)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("tbody-movimentacoes");
      tbody.innerHTML = ""; // Limpar antes de inserir os dados
      let saldo = 0;

      // Ordenar por data (da mais recente para a mais antiga)
      data.sort((a, b) => new Date(b.data) - new Date(a.data));

      // Calcular saldo usando todas as transações
      data.forEach((movimentacao) => {
        const categoriaTipo = categoriasMap[movimentacao.categoria_id];
        if (categoriaTipo === "entrada") {
          saldo += movimentacao.valor;
        } else if (categoriaTipo === "saída") {
          saldo -= movimentacao.valor;
        }
      });

      // Exibir apenas as 10 mais recentes
      const ultimasMovimentacoes = data.slice(0, 10);
      ultimasMovimentacoes.forEach((movimentacao) => {
        const categoria = listaCategorias.find(
          (categoria) => categoria.id === movimentacao.categoria_id
        );
        const categoriaNome = categoria?.nome || "Categoria não encontrada";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${movimentacao.id}</td>
            <td>${new Date(movimentacao.data).toLocaleDateString("pt-BR")}</td>
            <td>${movimentacao.descricao}</td>
            <td>${categoriaNome}</td>
            <td>R$ ${movimentacao.valor.toFixed(2)}</td>
            <td>
                <button class="btn btn-secondary btn-editar">Editar</button>  
                <button class="btn btn-danger">Excluir</button>
            </td>
          `;
        tbody.appendChild(tr);
      });

    
      if (saldo === 0) {
        document.getElementById("balance-p").textContent = "R$ 0,00";
      } else {
        // se saldo for positivo, adicionar o sinal de "+" e formatar como moeda
        document.getElementById("balance-p").textContent = `${
          saldo > 0 ? "+" : ""
        }${saldo.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}`;
      }
    })
    .catch((error) => {
      console.log("Erro ao buscar movimentações:", error);
    });
}
