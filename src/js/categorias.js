const categoriasTable = document.getElementById("categorias");
const formCategoria = document.getElementById("form-categoria");
const criarModal = document.getElementById("modal");

const categorias = [];


fetch(`http://localhost:3000/categorias/${user.id}`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    categorias.push(...data);
    console.log(categorias);
    categoriasTable.innerHTML = categorias
      .map(
        (categoria) => `
                <tr>
                    <td></td>
                    <td>${categoria.nome}</td>
                    <td>${categoria.tipo}</td>
                    <td>
                        <button class="btn btn-primary" id="editBtn" onclick="editarCategoria(${categoria.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
                    </td>
                </tr>
            `
      )
      .join("");
  });

  formCategoria.addEventListener("submit", (event) => {
    event.preventDefault();
    const nome = document.getElementById("input-nome").value;
    const tipo = document.getElementById("input-tipo").value;
    const usuario_id = user.id;

    try {
        fetch("http://localhost:3000/categorias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, tipo, usuario_id }),
        })
        .then((response) => response.json())
        .then((data) => {
            categorias.push(data);
            categoriasTable.innerHTML = categorias
                .map(
                    (categoria) => `
                        <tr>
                            <td>${categoria.id}</td>
                            <td>${categoria.nome}</td>
                            <td>${categoria.tipo}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editarCategoria(${categoria.id})">Editar</button>
                                <button class="btn btn-danger" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
                            </td>
                        </tr>
                    `
                )
                .join("");

            // Fecha o modal de adição
            const modalAdd = bootstrap.Modal.getInstance(document.getElementById('modalAdd'));
            modalAdd.hide();

            // Reseta o formulário
            formCategoria.reset();
        });
    } catch (error) {
        console.log(error);
    }
});

// editarCategoria

async function editarCategoria(id) {
  const categoria = categorias.find((categoria) => categoria.id === id);
  const nome = document.getElementById("input-nome-editar");
  const tipo = document.getElementById("input-tipo-editar");

  nome.value = categoria.nome;
  tipo.value = categoria.tipo;

  // Abre o modal de edição
  const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
  modalEdit.show();

  const formEditar = document.getElementById("form-categoria-editar");

  formEditar.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("input-nome-editar").value;
      const tipo = document.getElementById("input-tipo-editar").value;

      fetch(`http://localhost:3000/categorias/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome, tipo }),
      })
      .then((response) => response.json())
      .then((data) => {
          categorias[categorias.indexOf(categoria)] = data;
          categoriasTable.innerHTML = categorias
              .map(
                  (categoria) => `
                      <tr>
                          <td>${categoria.id}</td>
                          <td>${categoria.nome}</td>
                          <td>${categoria.tipo}</td>
                          <td>
                              <button class="btn btn-primary" onclick="editarCategoria(${categoria.id})">Editar</button>
                              <button class="btn btn-danger" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
                          </td>
                      </tr>
                  `
              )
              .join("");
          modalEdit.hide(); // Fecha o modal após a edição
      });
  });
}

// deleteCategoria
async function deleteCategoria(id) {
  await fetch(`http://localhost:3000/categorias/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      categorias = categorias.filter((categoria) => categoria.id !== id);
      categoriasTable.innerHTML = categorias
        .map(
          (categoria) => `
                    <tr>
                        <td>${categoria.id}</td>
                        <td>${categoria.nome}</td>
                        <td>${categoria.tipo}</td>
                        <td>
                            <button class="btn btn-primary" id="editBtn" onclick="editarCategoria(${categoria.id})">Editar</button>
                            <button class="btn btn-danger" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
                        </td>
                    </tr>
                `
        )
        .join("");
    });
}
