const PASSWORD = "Tirth@369";
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentEditIndex = null;

function verifyPassword() {
    const passwordInput = document.getElementById('password-input')?.value;
    const passwordPrompt = document.getElementById('password-prompt');
    const publishForm = document.getElementById('publish-form');
    const passwordError = document.getElementById('password-error');

    if (passwordInput === PASSWORD) {
        passwordPrompt.style.display = 'none';
        publishForm.style.display = 'block';
    } else {
        passwordError.style.display = 'block';
    }
}

function publishPost() {
    const title = document.getElementById('post-title')?.value.trim();
    const content = document.getElementById('post-content')?.value.trim();
    const imageFile = document.getElementById('post-image')?.files[0];
    const pdfFile = document.getElementById('post-pdf')?.files[0];

    if (!title || !content) {
        alert('Title and abstract are required.');
        return;
    }

    const post = {
        id: Date.now(), // Unique ID for each post
        title,
        content,
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        pdf: pdfFile ? URL.createObjectURL(pdfFile) : null,
        date: new Date().toLocaleDateString()
    };

    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    clearForm();
    alert('Post published successfully!');
}

function clearForm() {
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const imageInput = document.getElementById('post-image');
    const pdfInput = document.getElementById('post-pdf');
    const autosaveStatus = document.getElementById('autosave-status');

    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    if (imageInput) imageInput.value = '';
    if (pdfInput) pdfInput.value = '';
    if (autosaveStatus) autosaveStatus.textContent = 'Autosaved';
}

function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            ${post.pdf ? `<a href="${post.pdf}" target="_blank">View PDF</a>` : ''}
            <p><small>Posted on: ${post.date}</small></p>
            <button onclick="promptEditPost(${index})">Edit</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

function promptEditPost(index) {
    const password = prompt('Enter password to edit/delete post:');
    if (password === PASSWORD) {
        currentEditIndex = index;
        const publishForm = document.getElementById('publish-form');
        const editForm = document.getElementById('edit-post-form');
        if (publishForm) publishForm.style.display = 'none';
        if (editForm) {
            editForm.style.display = 'block';
            document.getElementById('edit-post-title').value = posts[index].title;
            document.getElementById('edit-post-content').value = posts[index].content;
        }
    } else {
        alert('Incorrect password!');
    }
}

function saveEditedPost() {
    const title = document.getElementById('edit-post-title')?.value.trim();
    const content = document.getElementById('edit-post-content')?.value.trim();
    const imageFile = document.getElementById('edit-post-image')?.files[0];
    const pdfFile = document.getElementById('edit-post-pdf')?.files[0];

    if (!title || !content) {
        alert('Title and abstract are required.');
        return;
    }

    posts[currentEditIndex] = {
        ...posts[currentEditIndex],
        title,
        content,
        image: imageFile ? URL.createObjectURL(imageFile) : posts[currentEditIndex].image,
        pdf: pdfFile ? URL.createObjectURL(pdfFile) : posts[currentEditIndex].pdf,
        date: new Date().toLocaleDateString()
    };

    localStorage.setItem('posts', JSON.stringify(posts));
    const editForm = document.getElementById('edit-post-form');
    const publishForm = document.getElementById('publish-form');
    if (editForm) editForm.style.display = 'none';
    if (publishForm) publishForm.style.display = 'block';
    displayPosts();
    alert('Post updated successfully!');
}

function deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
        posts.splice(currentEditIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        const editForm = document.getElementById('edit-post-form');
        const publishForm = document.getElementById('publish-form');
        if (editForm) editForm.style.display = 'none';
        if (publishForm) publishForm.style.display = 'block';
        displayPosts();
        alert('Post deleted successfully!');
    }
}

function autosave() {
    const title = document.getElementById('post-title')?.value.trim();
    const content = document.getElementById('post-content')?.value.trim();
    const autosaveStatus = document.getElementById('autosave-status');
    if ((title || content) && autosaveStatus) {
        localStorage.setItem('draft', JSON.stringify({ title, content }));
        autosaveStatus.textContent = 'Autosaved at ' + new Date().toLocaleTimeString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const publishForm = document.getElementById('publish-form');
    const passwordPrompt = document.getElementById('password-prompt');

    if (postsContainer) {
        displayPosts();
    }

    if (publishForm && passwordPrompt) {
        passwordPrompt.style.display = 'block';
        const draft = JSON.parse(localStorage.getItem('draft')) || {};
        const titleInput = document.getElementById('post-title');
        const contentInput = document.getElementById('post-content');
        if (titleInput) titleInput.value = draft.title || '';
        if (contentInput) contentInput.value = draft.content || '';
        setInterval(autosave, 5000);
    }
});
