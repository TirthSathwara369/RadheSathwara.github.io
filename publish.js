// js/publish.js

document.addEventListener('DOMContentLoaded', () => {
    const publishForm = document.getElementById('publish-form');
    const postTitleInput = document.getElementById('post-title');
    const postDateInput = document.getElementById('post-date');
    const postCategoryInput = document.getElementById('post-category');
    const postImageURLInput = document.getElementById('post-image-url');
    const postContentTextarea = document.getElementById('post-content');
    const postKeywordsInput = document.getElementById('post-keywords');
    const pdfFileNameInput = document.getElementById('pdf-file-name');
    const generatedHtmlCode = document.getElementById('generated-html');
    const generatedHtmlPreview = document.getElementById('generated-html-preview');
    const clearDraftButton = document.getElementById('clear-draft');
    const editDeleteAccessButton = document.getElementById('edit-delete-access');
    const simulatedEditPanel = document.getElementById('simulated-edit-panel');

    const AUTOSAVE_KEY = 'researchPostDraft';
    const EDIT_PASSWORD = 'Tirth@369'; // The specified password

    // --- Autosave functionality ---
    function saveDraft() {
        const draft = {
            title: postTitleInput.value,
            date: postDateInput.value,
            category: postCategoryInput.value,
            imageUrl: postImageURLInput.value,
            content: postContentTextarea.value,
            keywords: postKeywordsInput.value,
            pdfName: pdfFileNameInput.value
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
        console.log('Draft saved automatically.');
    }

    function loadDraft() {
        const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            postTitleInput.value = draft.title || '';
            postDateInput.value = draft.date || new Date().toISOString().slice(0, 10); // Set current date if no draft date
            postCategoryInput.value = draft.category || '';
            postImageURLInput.value = draft.imageUrl || '';
            postContentTextarea.value = draft.content || '';
            postKeywordsInput.value = draft.keywords || '';
            pdfFileNameInput.value = draft.pdfName || '';
            console.log('Draft loaded.');
        } else {
            // Set current date if no draft exists
            postDateInput.value = new Date().toISOString().slice(0, 10);
        }
    }

    // Load draft on page load
    loadDraft();

    // Autosave on input change
    publishForm.addEventListener('input', saveDraft);

    // Clear draft button
    clearDraftButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your current draft? This action cannot be undone.')) {
            localStorage.removeItem(AUTOSAVE_KEY);
            publishForm.reset();
            postDateInput.value = new Date().toISOString().slice(0, 10); // Reset date to current
            generatedHtmlCode.textContent = '';
            generatedHtmlPreview.style.display = 'none';
            console.log('Draft cleared.');
        }
    });

    // --- HTML Generation on Submit ---
    publishForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const title = postTitleInput.value;
        const date = postDateInput.value;
        const category = postCategoryInput.value;
        const imageUrl = postImageURLInput.value;
        const content = postContentTextarea.value;
        const keywords = postKeywordsInput.value;
        const pdfName = pdfFileNameInput.value;

        // Basic validation
        if (!title || !date || !category || !content) {
            alert('Please fill in all required fields (Title, Date, Category, Content).');
            return;
        }

        // Generate a simple ID from the title for the anchor link
        const postId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

        let imageHtml = '';
        if (imageUrl) {
            imageHtml = `<img src="${imageUrl}" alt="${title} image" class="post-image">\n`;
        }

        let pdfLinkHtml = '';
        if (pdfName) {
            pdfLinkHtml = `                    <a href="papers/${pdfName}" target="_blank" class="button pdf-link">View Full Paper (PDF)</a>\n`;
        }

        const generatedHtml = `
            <article class="research-post" id="${postId}">
                <h3>${title}</h3>
                <p class="post-meta">Published: ${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Category: ${category}</p>
                <div class="post-content">
${imageHtml ? '                    ' + imageHtml : ''}
                    <p>
                        ${content.split('\n').map(p => p.trim()).filter(p => p).join('\n                        <p>\n')}
                    </p>
                    <p>
                        **Keywords:** ${keywords || 'No keywords provided'}.
                    </p>
${pdfLinkHtml}
                </div>
            </article>
            `.trim();

        generatedHtmlCode.textContent = generatedHtml;
        generatedHtmlPreview.style.display = 'block';

        // Optionally, scroll to the generated HTML section
        generatedHtmlPreview.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Password Protection for Simulated Edit/Delete ---
    editDeleteAccessButton.addEventListener('click', () => {
        const passwordAttempt = prompt('Please enter the password to access edit/delete functionality:');
        if (passwordAttempt === EDIT_PASSWORD) {
            simulatedEditPanel.style.display = 'block';
            alert('Access granted to simulated edit/delete panel.');
        } else {
            simulatedEditPanel.style.display = 'none';
            alert('Incorrect password. Access denied.');
        }
    });

    // --- Copy to Clipboard Function ---
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        let textToCopy = element.textContent;

        // Create a temporary textarea element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);

        // Select the text
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);

        alert('HTML code copied to clipboard!');
    };
});
