
// Global storage for papers and thoughts
let researchPapers = [];
let scientificThoughts = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    setupEventListeners();
    renderPapers();
    renderThoughts();
    updateStats();
});

// Load data from localStorage
function loadStoredData() {
    const storedPapers = localStorage.getItem('researchPapers');
    const storedThoughts = localStorage.getItem('scientificThoughts');
    
    if (storedPapers) {
        researchPapers = JSON.parse(storedPapers);
    }
    
    if (storedThoughts) {
        scientificThoughts = JSON.parse(storedThoughts);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('researchPapers', JSON.stringify(researchPapers));
    localStorage.setItem('scientificThoughts', JSON.stringify(scientificThoughts));
}

// Setup event listeners
function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Form submissions
    document.getElementById('paper-form').addEventListener('submit', handlePaperSubmission);
    document.getElementById('thought-form').addEventListener('submit', handleThoughtSubmission);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
