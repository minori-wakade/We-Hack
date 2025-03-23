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
//Email
(function(){
    emailjs.init("qeE9QIMiu9sPb7Rsw"); // Replace with your actual Public Key
 })();

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user input values
    let name = document.getElementById("first-name").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;

    // Sending email via EmailJS
    emailjs.send("service_am66nnr", "template_plfs07q", {
        name: name,
        email: email,
        subject: subject,
        message: message
    }).then(function(response) {
        document.getElementById("response-message").innerText = "Email sent successfully!";
    }, function(error) {
        document.getElementById("response-message").innerText = "Failed to send email!";
    });
});