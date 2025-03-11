const user = JSON.parse(localStorage.getItem("usuario"));

btnLogIn = document.getElementById("logIn");
btnSignUp = document.getElementById("signUp");

btnLogIn.addEventListener("click", () => {
  if(user) {
    window.location.href = "http://localhost/finance-manager-front/dashboard.html";
  } else {
    window.location.href = "http://localhost/finance-manager-front/login.html";
  }
});

btnSignUp.addEventListener("click", () => {
  // limpa user e localStorage
  localStorage.clear();
  user = null;
  window.location.href = "http://localhost/finance-manager-front/signup.html";
});