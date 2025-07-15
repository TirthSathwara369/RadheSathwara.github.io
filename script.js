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
            block: 'start'
        });
    }
}

// Handle paper form submission
async function handlePaperSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('paper-title').value;
    const abstract = document.getElementById('paper-abstract').value;
    const keywords = document.getElementById('paper-keywords').value;
    const file = document.getElementById('paper-file').files[0];
    const image = document.getElementById('paper-image').files[0];
    
    if (!title || !abstract || !file) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const paper = {
        id: Date.now(),
        title: title,
        abstract: abstract,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        uploadDate: new Date().toLocaleDateString(),
        image: image ? await fileToBase64(image) : null
    };
    
    researchPapers.push(paper);
    saveData();
    renderPapers();
    updateStats();
    
    // Reset form
    document.getElementById('paper-form').reset();
    showNotification('Research paper uploaded successfully!', 'success');
}

// Handle thought form submission
async function handleThoughtSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('thought-title').value;
    const content = document.getElementById('thought-content').value;
    const category = document.getElementById('thought-category').value;
    const image = document.getElementById('thought-image').files[0];
    
    if (!title || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const thought = {
        id: Date.now(),
        title: title,
        content: content,
        category: category || 'General',
        uploadDate: new Date().toLocaleDateString(),
        image: image ? await fileToBase64(image) : null
    };
    
    scientificThoughts.push(thought);
    saveData();
    renderThoughts();
    updateStats();
    
    // Reset form
    document.getElementById('thought-form').reset();
    showNotification('Scientific thought shared successfully!', 'success');
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Render research papers
function renderPapers() {
    const papersGrid = document.getElementById('papers-grid');
    
    if (researchPapers.length === 0) {
        papersGrid.innerHTML = `
            <div class="empty-state">
                <h3>No research papers yet</h3>
                <p>Upload your first research paper to get started!</p>
                <button class="btn btn-primary" onclick="scrollToSection('upload')">Upload Paper</button>
            </div>
        `;
        return;
    }
    
    papersGrid.innerHTML = researchPapers.map(paper => `
        <div class="paper-card" data-id="${paper.id}">
            ${paper.image ? `<img src="${paper.image}" alt="${paper.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem;">` : ''}
            <h3 class="card-title">${paper.title}</h3>
            <div class="card-meta">
                <span>📄 ${paper.fileName}</span> | 
                <span>📊 ${paper.fileSize}</span> | 
                <span>📅 ${paper.uploadDate}</span>
            </div>
            <div class="card-content">
                <p>${paper.abstract}</p>
            </div>
            ${paper.keywords.length > 0 ? `
                <div class="card-keywords">
                    ${paper.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                </div>
            ` : ''}
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="deletePaper(${paper.id})" style="background: #ff4444; border-color: #ff4444;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render scientific thoughts
function renderThoughts() {
    const thoughtsGrid = document.getElementById('thoughts-grid');
    
    if (scientificThoughts.length === 0) {
        thoughtsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No scientific thoughts yet</h3>
                <p>Share your first scientific observation or idea!</p>
                <button class="btn btn-primary" onclick="scrollToSection('upload')">Share Thought</button>
            </div>
        `;
        return;
    }
    
    thoughtsGrid.innerHTML = scientificThoughts.map(thought => `
        <div class="thought-card" data-id="${thought.id}">
            ${thought.image ? `<img src="${thought.image}" alt="${thought.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem;">` : ''}
            <h3 class="card-title">${thought.title}</h3>
            <div class="card-meta">
                <span>🔬 ${thought.category}</span> | 
                <span>📅 ${thought.uploadDate}</span>
            </div>
            <div class="card-content">
                <p>${thought.content}</p>
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="deleteThought(${thought.id})" style="background: #ff4444; border-color: #ff4444;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    document.getElementById('paper-count').textContent = researchPapers.length;
    document.getElementById('thought-count').textContent = scientificThoughts.length;
}

// Delete paper
function deletePaper(id) {
    if (confirm('Are you sure you want to delete this research paper?')) {
        researchPapers = researchPapers.filter(paper => paper.id !== id);
        saveData();
        renderPapers();
        updateStats();
        showNotification('Research paper deleted successfully!', 'success');
    }
}

// Delete thought
function deleteThought(id) {
    if (confirm('Are you sure you want to delete this scientific thought?')) {
        scientificThoughts = scientificThoughts.filter(thought => thought.id !== id);
        saveData();
        renderThoughts();
        updateStats();
        showNotification('Scientific thought deleted successfully!', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff4444' : '#00ffff'};
        color: #000;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed #00ffff;
        border-radius: 10px;
    }
    
    .empty-state h3 {
        color: #00ffff;
        margin-bottom: 1rem;
        font-family: 'Orbitron', monospace;
    }
    
    .empty-state p {
        margin-bottom: 2rem;
        color: #b0b0b0;
    }
`;
document.head.appendChild(style);

// Add some sample data for demonstration
if (researchPapers.length === 0 && scientificThoughts.length === 0) {
    // Add sample research paper
    researchPapers.push({
        id: 1,
        title: "Quantum Computing Applications in Modern Cryptography",
        abstract: "This paper explores the potential applications of quantum computing in revolutionizing modern cryptographic systems, examining both opportunities and challenges.",
        keywords: ["quantum computing", "cryptography", "security", "algorithms"],
        fileName: "quantum-crypto-research.pdf",
        fileSize: "2.3 MB",
        uploadDate: new Date().toLocaleDateString(),
        image: null
    });
    
    // Add sample scientific thought
    scientificThoughts.push({
        id: 1,
        title: "The Future of Renewable Energy Storage",
        content: "Considering the rapid advancement in battery technology and the increasing demand for renewable energy, I believe we're on the verge of a breakthrough in energy storage solutions that could revolutionize how we power our world.",
        category: "Energy Science",
        uploadDate: new Date().toLocaleDateString(),
        image: null
    });
    
    saveData();
}
