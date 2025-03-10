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
});