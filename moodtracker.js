const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

const monthDisplay = document.getElementById("month-display");
const calendar = document.querySelector(".calendar");
const moodForm = document.querySelector(".mood-form");
const selectedDateInput = document.getElementById("selected-date");
const moodSelect = document.getElementById("mood");
const noteInput = document.getElementById("note");
const notesList = document.getElementById("notes-list");
const deleteMoodBtn = document.getElementById("delete-mood-btn");
const deleteAllNotesBtn = document.getElementById("delete-all-notes-btn");

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function updateCalendar() {
    calendar.innerHTML = "";
    monthDisplay.textContent = `${months[month]}, ${year}`;

    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = i;
        dayDiv.addEventListener("click", () => selectDate(i));

        let savedMood = localStorage.getItem(`mood-${year}-${month}-${i}`);
        if (savedMood) {
            dayDiv.classList.add("mood-day");
            dayDiv.innerHTML = `<p>${i}</p><p>${savedMood}</p>`;
        }

        calendar.appendChild(dayDiv);
    }
}

function selectDate(day) {
    selectedDateInput.value = `${day} ${months[month]}, ${year}`;
    displayNotes(day);
    updateDeleteMoodButton(day);
}

moodForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectedDateInput.value) {
        alert("Please select a date first!");
        return;
    }

    let day = selectedDateInput.value.split(" ")[0];
    let dateKey = `mood-${year}-${month}-${day}`;
    let noteKey = `notes-${year}-${month}-${day}`;

    localStorage.setItem(dateKey, moodSelect.value);

    let notes = JSON.parse(localStorage.getItem(noteKey)) || [];
    if (noteInput.value.trim()) {
        notes.push({ text: noteInput.value.trim(), date: `${day} ${months[month]}, ${year}` });
        localStorage.setItem(noteKey, JSON.stringify(notes));
    }

    updateCalendar();
    displayNotes(day);
    moodForm.reset();
});

function displayNotes(day) {
    notesList.innerHTML = "";

    let noteKey = `notes-${year}-${month}-${day}`;
    let notes = JSON.parse(localStorage.getItem(noteKey)) || [];

    if (notes.length === 0) {
        notesList.innerHTML = "<p>No notes for this day.</p>";
        deleteAllNotesBtn.style.display = "none";
        return;
    }

    deleteAllNotesBtn.style.display = "block";

    notes.forEach((note, index) => {
        let noteItem = document.createElement("div");
        noteItem.classList.add("note-item");
        noteItem.innerHTML = `
            <p><strong>${note.date}</strong></p>
            <p>"${note.text}"</p>
            <button onclick="deleteNote(${day}, ${index})"><span id="remove-btn-text">Remove</span></button>
        `;
        notesList.appendChild(noteItem);
    });
}

function deleteNote(day, index) {
    let noteKey = `notes-${year}-${month}-${day}`;
    let notes = JSON.parse(localStorage.getItem(noteKey)) || [];

    notes.splice(index, 1);
    localStorage.setItem(noteKey, JSON.stringify(notes));

    displayNotes(day);
}

function deleteAllNotes() {
    if (!selectedDateInput.value) return;

    let day = selectedDateInput.value.split(" ")[0];
    let noteKey = `notes-${year}-${month}-${day}`;
    localStorage.removeItem(noteKey);
    
    displayNotes(day);
}

function deleteMood() {
    if (!selectedDateInput.value) return;

    let day = selectedDateInput.value.split(" ")[0];
    let dateKey = `mood-${year}-${month}-${day}`;
    localStorage.removeItem(dateKey);

    updateCalendar();
    updateDeleteMoodButton(day);
}

function updateDeleteMoodButton(day) {
    let dateKey = `mood-${year}-${month}-${day}`;
    if (localStorage.getItem(dateKey)) {
        deleteMoodBtn.style.display = "block";
    } else {
        deleteMoodBtn.style.display = "none";
    }
}

document.getElementById("prev-btn").addEventListener("click", () => {
    month = month === 0 ? 11 : month - 1;
    updateCalendar();
    clearNotesList();
});

document.getElementById("next-btn").addEventListener("click", () => {
    month = month === 11 ? 0 : month + 1;
    updateCalendar();
    clearNotesList();
});

function clearNotesList() {
    notesList.innerHTML = "<p>Select a day to see notes.</p>";
    deleteAllNotesBtn.style.display = "none";
    deleteMoodBtn.style.display = "none";
}

updateCalendar();
