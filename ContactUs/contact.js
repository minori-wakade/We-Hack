document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                console.log("Message sent!");
                alert("Your message has been sent successfully!");
                form.reset();
            } else {
                alert("Please fill out all required fields.");
            }
        });
    }
});
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.onclick = () => navLinks.classList.toggle("show");