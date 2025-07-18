// js/script.js
// This file can be used for general website-wide JavaScript functionalities.
// For now, it's mostly a placeholder as most specific logic is in publish.js

document.addEventListener('DOMContentLoaded', () => {
    // Example: Highlight active navigation link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // You can add more general-purpose scripts here later, e.g.,
    // smooth scrolling, simple animations, etc.
});
