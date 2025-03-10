const user = JSON.parse(localStorage.getItem("usuario"));
const nomeUsuario = document.getElementById("username");	
// console.log(user);

nomeUsuario.innerHTML = user.nome;

if (!user) {
  window.location.href = "http://localhost/finance-manager-front/login.html";
}

const btnLogout = document.getElementById("logout");

btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "http://localhost/finance-manager-front/login.html";
});