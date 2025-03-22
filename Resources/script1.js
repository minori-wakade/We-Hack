// Function for Right Scroll
function scrollRight(id) {
    let container = document.getElementById(id);
    let scrollAmount = container.clientWidth; // Scroll by container width

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setTimeout(() => updateButtons(id), 500); // Update button states after scrolling
}

// Function for Left Scroll
function scrollLeft(id) {
    let container = document.getElementById(id);
    let scrollAmount = -container.clientWidth; // Scroll by container width

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setTimeout(() => updateButtons(id), 500); // Update button states after scrolling
}

// Function to enable/disable buttons
function updateButtons(id) {
    let container = document.getElementById(id);
    let leftBtn = document.querySelector(`.scroll-btn.left[onclick="scrollLeft('${id}')"]`);
    let rightBtn = document.querySelector(`.scroll-btn.right[onclick="scrollRight('${id}')"]`);

    // Disable left button if at the start
    leftBtn.disabled = container.scrollLeft <= 10;

    // Disable right button if at the end
    rightBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
}

// Run on page load to update button states
document.addEventListener("DOMContentLoaded", function () {
    updateButtons("articles");
    updateButtons("videos");
});
function searchResources() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".resource-card");

    cards.forEach(card => {
        let title = card.querySelector("h3").innerText.toLowerCase();
        let description = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";

        if (title.includes(input) || description.includes(input)) {
            card.style.display = "block"; // Show the matching cards
        } else {
            card.style.display = "none"; // Hide the non-matching cards
        }
    });
}
