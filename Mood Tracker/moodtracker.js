const calendar = document.getElementById("calendar");
const monthYearDisplay = document.getElementById("monthYear");
const moodModal = document.getElementById("moodModal");
const selectedDateDisplay = document.getElementById("selectedDate");
const moodButtons = document.querySelectorAll(".emoji");
const noteInput = document.getElementById("note");
const saveMoodButton = document.getElementById("saveMood");
const deleteMoodButton = document.getElementById("deleteMood");
const closeButton = document.querySelector(".close");
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


function loadCalendar(month, year) {
    calendar.innerHTML = "";
    monthYearDisplay.textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        const prevDiv = document.createElement("div");
        prevDiv.className = "day prev-month";
        prevDiv.textContent = prevDays - i;
        calendar.appendChild(prevDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.textContent = day;

        const savedMood = localStorage.getItem(`${year}-${month + 1}-${day}`);
        if (savedMood) {
            const { mood } = JSON.parse(savedMood);
            dayDiv.classList.add(mood);
        }

        dayDiv.onclick = () => openMoodModal(year, month, day);
        calendar.appendChild(dayDiv);
    }

    const nextDays = 7 - (calendar.childElementCount % 7);
    for (let i = 1; i <= nextDays; i++) {
        const nextDiv = document.createElement("div");
        nextDiv.className = "day next-month";
        nextDiv.textContent = i;
        calendar.appendChild(nextDiv);
    }
}

function openMoodModal(year, month, day) {
    selectedDate = new Date(year, month, day);
    selectedDateDisplay.textContent = selectedDate.toDateString();
    noteInput.value = "";

    // Clear all previously selected emojis
    moodButtons.forEach(button => button.classList.remove("selected"));

    // Retrieve the saved mood and note for the selected date
    const savedMood = localStorage.getItem(`${year}-${month + 1}-${day}`);
    if (savedMood) {
        const { mood, note } = JSON.parse(savedMood);
        // Highlight the emoji corresponding to the saved mood
        const moodButton = document.querySelector(`.emoji[data-mood="${mood}"]`);
        if (moodButton) {
            moodButton.classList.add("selected");
        }
        noteInput.value = note; // Set the note in the input field
    }

    // Display the modal
    moodModal.style.display = "block";
}


saveMoodButton.onclick = () => {
    const selectedMoodButton = document.querySelector(".emoji.selected");
    if (selectedMoodButton) {
        const mood = selectedMoodButton.getAttribute("data-mood");
        const note = noteInput.value;
        localStorage.setItem(`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`, JSON.stringify({ mood, note }));
        loadCalendar(currentMonth, currentYear);
        moodModal.style.display = "none";
    }
};

deleteMoodButton.onclick = () => {
    localStorage.removeItem(`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`);
    loadCalendar(currentMonth, currentYear);
    moodModal.style.display = "none";
};

closeButton.onclick = () => moodModal.style.display = "none";

document.getElementById("prevMonth").onclick = () => {
    currentMonth = (currentMonth - 1 + 12) % 12;
    if (currentMonth === 11) currentYear--;
    loadCalendar(currentMonth, currentYear);
};

document.getElementById("nextMonth").onclick = () => {
    currentMonth = (currentMonth + 1) % 12;
    if (currentMonth === 0) currentYear++;
    loadCalendar(currentMonth, currentYear);
};

document.querySelectorAll(".emoji").forEach(btn => {
    btn.onclick = () => {
        moodButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
    };
});

loadCalendar(currentMonth, currentYear);

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});


