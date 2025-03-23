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
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});
(function() {
    emailjs.init("qeE9QIMiu9sPb7Rsw"); // Replace with your EmailJS public key
})();

function sendEmail(event) {
    event.preventDefault();

    emailjs.send("SERVICE_AM66NNR", "TEMPLATE_PLFS07Q", {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    }).then(function(response) {
        alert("Email sent successfully!");
    }, function(error) {
        alert("Failed to send email: " + JSON.stringify(error));
    });
}
