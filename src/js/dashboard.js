// Obtém o modal pelo ID
var modal = new bootstrap.Modal(document.getElementById('modal'));

// Obtém o botão que abre o modal
var btn = document.getElementById("adicionarMovimentacao");

// Adiciona um evento de clique no botão para abrir o modal
btn.addEventListener("click", function () {
    modal.show();
});
