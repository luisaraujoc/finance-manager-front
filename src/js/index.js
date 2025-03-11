<<<<<<< HEAD
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
=======
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');

    mobileMenuIcon.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-content-right') && 
            !event.target.closest('.mobile-menu')) {
            mobileMenu.classList.remove('active');
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
>>>>>>> 979c13d241272a29e5f07605ed282e67652afd05
});