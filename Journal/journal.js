// List of inspirational quotes
const quotes = [
    "Start where you are. Use what you have. Do what you can.",
    "The best time for new beginnings is now.",
    "Happiness is not by chance, but by choice.",
    "Gratitude turns what we have into enough.",
    "Take it one day at a time.",
    "Your mind is a garden, your thoughts are the seeds.",
    "Every moment is a fresh beginning.",
    "Self-care is not selfish, it's necessary.",
    "The way you speak to yourself matters.",
    "Write it down now, reflect on it later."
];

// Display a random quote
document.getElementById('quote').textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;

// Select elements
const saveEntryButton = document.getElementById('save-entry');
const entriesList = document.getElementById('entries-list');
const searchInput = document.getElementById('search');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');

// Toggle mobile navigation
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('show') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.nav-toggle')) {
        navLinks.classList.remove('show');
    }
});

// Load saved entries from local storage or initialize an empty array
let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

// Function to save entries to local storage
function saveToLocalStorage() {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original string if it can't be parsed
        }
        
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return date.toLocaleDateString(undefined, options);
    } catch (e) {
        return dateString;
    }
}

// Show notification
function showNotification(message, isError = false) {
    const form = document.querySelector('.journal-form');
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.color = isError ? "#ff5555" : "#466245";
    notification.style.backgroundColor = isError ? "#ffeeee" : "#eeffee";
    notification.style.textAlign = "center";
    notification.style.padding = "10px";
    notification.style.marginTop = "15px";
    notification.style.borderRadius = "8px";
    notification.style.transition = "opacity 0.5s ease";
    form.appendChild(notification);
    
    // Fade out and remove the notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2500);
}

// Save journal entry
saveEntryButton.addEventListener('click', () => {
    const journalText = document.getElementById('journal-entry').value.trim();
    const tagsText = document.getElementById('tags').value.trim();
    const gratitudeText = document.getElementById('gratitude').value.trim();

    if (!journalText) {
        showNotification("Please write something about your day.", true);
        return;
    }

    // Extract hashtags from journal text
    const hashtagRegex = /#(\w+)/g;
    const hashtagMatches = journalText.match(hashtagRegex) || [];
    const hashtagsFromText = hashtagMatches.map(tag => tag.substring(1).toLowerCase());
    
    // Combine explicit tags and hashtags from text
    const explicitTags = tagsText ? tagsText.split(',').map(tag => tag.trim().toLowerCase()) : [];
    const combinedTags = [...new Set([...explicitTags, ...hashtagsFromText])];

    const timestamp = new Date().toLocaleString();
    const entry = {
        text: journalText,
        tags: combinedTags,
        gratitude: gratitudeText,
        timestamp: timestamp
    };

    entries.unshift(entry); // Add to beginning of array to show newest first
    saveToLocalStorage(); // Save to local storage
    renderEntries(entries);
    renderTagList();

    // Add a small animation to the entries list
    entriesList.classList.add('updated');
    setTimeout(() => {
        entriesList.classList.remove('updated');
    }, 1000);

    // Clear inputs
    document.getElementById('journal-entry').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('gratitude').value = '';
    
    // Show success message
    showNotification("Entry saved successfully!");
});

// Function to render journal entries
function renderEntries(filteredEntries) {
    entriesList.innerHTML = '';

    if (filteredEntries.length === 0) {
        entriesList.innerHTML = '<div class="no-entries">No entries found. Start journaling today!</div>';
        return;
    }

    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        
        // Format text to make hashtags stand out
        const formattedText = entry.text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
        
        // Format tags for display
        const formattedTags = entry.tags.length > 0 
            ? entry.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join(' ')
            : 'No tags';
            
        li.innerHTML = `
            <p>${formattedText}</p>
            <div class="entry-meta">
                <span class="entry-date">${formatDate(entry.timestamp)}</span>
                <span class="entry-tags">Tags: ${formattedTags}</span>
                ${entry.gratitude ? `<span class="entry-gratitude">Gratitude: ${entry.gratitude}</span>` : ''}
            </div>
            <button class="delete-entry" data-index="${index}">Delete</button>
        `;
        entriesList.appendChild(li);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-entry').forEach(button => {
        button.addEventListener('click', deleteEntry);
    });
}

// Function to delete an entry
function deleteEntry(event) {
    if (confirm("Are you sure you want to delete this entry?")) {
        const index = event.target.getAttribute('data-index');
        entries.splice(index, 1);
        saveToLocalStorage(); // Update local storage
        renderEntries(entries);
        renderTagList();
    }
}

// Filter entries based on search input
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredEntries = entries.filter(entry => 
        entry.text.toLowerCase().includes(keyword) ||
        entry.gratitude?.toLowerCase().includes(keyword) ||
        entry.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    renderEntries(filteredEntries);
});

// Render tag list
function renderTagList() {
    // Get all tags from all entries
    const allTags = entries.flatMap(entry => entry.tags).filter(tag => tag);
    
    // Count occurrences of each tag
    const tagCount = {};
    allTags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    
    // Get unique tags
    const uniqueTags = [...new Set(allTags)];
    
    // Sort tags by frequency (most frequent first)
    uniqueTags.sort((a, b) => tagCount[b] - tagCount[a]);
    
    const tagContainer = document.getElementById('tag-list');
    tagContainer.innerHTML = '';

    if (uniqueTags.length === 0) {
        tagContainer.innerHTML = '<p class="no-tags">No tags yet. Add tags to your entries to organize them.</p>';
        return;
    }

    uniqueTags.forEach(tag => {
        const tagElement = document.createElement('button');
        tagElement.textContent = `${tag} (${tagCount[tag]})`;
        tagElement.addEventListener('click', () => {
            searchInput.value = tag;
            const filteredEntries = entries.filter(entry => entry.tags.includes(tag));
            renderEntries(filteredEntries);
        });
        tagContainer.appendChild(tagElement);
    });
    
    // Add "Show All" button
    const showAllButton = document.createElement('button');
    showAllButton.textContent = "Show All";
    showAllButton.classList.add('show-all');
    showAllButton.addEventListener('click', () => {
        searchInput.value = "";
        renderEntries(entries);
    });
    tagContainer.appendChild(showAllButton);
}

// Auto resize textarea as user types
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderEntries(entries);
    renderTagList();
    
    // Check if there are no entries and show a welcome message
    if (entries.length === 0) {
        const form = document.querySelector('.journal-form');
        const welcome = document.createElement('div');
        welcome.innerHTML = `
            <div style="text-align: center; padding: 15px; margin-top: 20px; background-color: #f0f7f0; border-radius: 8px;">
                <h3 style="color: #466245; margin-bottom: 10px;">Welcome to Your Journal!</h3>
                <p>This is a safe space to record your thoughts, feelings, and gratitude.</p>
                <p style="font-style: italic; margin-top: 10px;">Start writing your first entry above.</p>
            </div>
        `;
        form.after(welcome);
    }
});