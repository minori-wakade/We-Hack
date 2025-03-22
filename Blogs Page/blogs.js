// Sample functionality to highlight active tag
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        alert(`Filtering articles related to: ${this.textContent}`);
    });
});
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});