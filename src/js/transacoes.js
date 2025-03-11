let movimentacoes = []; // Array para armazenar todas as movimentações
let itensExibidos = 12; // Quantidade inicial de itens exibidos

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
                    <td>${formatarData(movimentacao.data)}</td>
                    <td>${movimentacao.descricao}</td>
                    <td>${movimentacao.categoria_nome || "Sem categoria"}</td>
                    <td>${movimentacao.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editarMovimentacao(${movimentacao.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteMovimentacao(${movimentacao.id})">Eliminar</button>
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

// Função para buscar todas as movimentações
function buscarMovimentacoes() {
    fetch(`http://localhost:3000/movimentacoes/${user.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Movimentações carregadas:", data);
            movimentacoes = data;
            popularTabela(movimentacoes, itensExibidos);
        })
        .catch((error) => console.error("Erro ao buscar movimentações:", error));
}

// Função para adicionar uma movimentação
function adicionarMovimentacao(valor, descricao, categoria_id, data) {
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
            usuario_id: user.id,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Movimentação adicionada:", data);
            movimentacoes.unshift(data); // Adiciona no início do array
            popularTabela(movimentacoes, itensExibidos);
            exibirToast("Movimentação adicionada com sucesso!", "success");
        })
        .catch((error) => {
            console.error("Erro ao adicionar movimentação:", error);
            exibirToast("Erro ao adicionar movimentação.", "danger");
        });
}

// Função para editar uma movimentação
function editarMovimentacao(id) {
    const movimentacao = movimentacoes.find((mov) => mov.id === id);
    if (movimentacao) {
        // Preenche o modal de edição com os dados da movimentação
        document.getElementById("input-valor").value = movimentacao.valor;
        document.getElementById("input-descricao").value = movimentacao.descricao;
        document.getElementById("input-categoria").value = movimentacao.categoria_id;
        document.getElementById("input-data").value = movimentacao.data.split("T")[0];

        // Abre o modal de edição
        const modal = new bootstrap.Modal(document.getElementById("modal"));
        modal.show();
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
                    // Remove a movimentação da lista local
                    movimentacoes = movimentacoes.filter((mov) => mov.id !== id);
                    popularTabela(movimentacoes, itensExibidos);
                    exibirToast("Movimentação excluída com sucesso!", "success");
                }
            })
            .catch((error) => {
                console.error("Erro ao excluir movimentação:", error);
                exibirToast("Erro ao excluir movimentação.", "danger");
            });
    }
}

// Evento de clique no botão "Ver mais"
document.getElementById("loadMore").addEventListener("click", () => {
    itensExibidos += 12; // Aumenta o número de itens exibidos
    popularTabela(movimentacoes, itensExibidos);
});

// Evento de submit do formulário de adição/edição
document.getElementById("formMovimentacao").addEventListener("submit", (event) => {
    event.preventDefault();
    const valor = document.getElementById("input-valor").value;
    const descricao = document.getElementById("input-descricao").value;
    const categoria_id = document.getElementById("input-categoria").value;
    const data = document.getElementById("input-data").value;

    adicionarMovimentacao(valor, descricao, categoria_id, data);

    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("modal"));
    modal.hide();
});

// Função para exibir toasts
function exibirToast(mensagem, tipo) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast", "align-items-center", "text-white", `bg-${tipo}`, "border-0");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensagem}</div>
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

// Inicialização
buscarMovimentacoes();