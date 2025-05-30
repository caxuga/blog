document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const authorInput = document.getElementById('author');
  const categoryInput = document.getElementById('category');
  const messageDiv = document.getElementById('message');
  const articlesListBody = document.getElementById('articles-list-body');
  
  // Ganti dengan URL backend Anda setelah di-deploy ke Vercel!
  const API_URL = 'https://smaink.vercel.app/api/posts';
  // Contoh: https://nurul-khalil-backend.vercel.app/api/posts
  
  // --- Fungsi untuk Menampilkan Pesan ---
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`; // Add success or error class
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000); // Hide after 5 seconds
  }
  
  // --- Fungsi untuk Mengirim Artikel Baru ---
  postForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Mencegah refresh halaman
    
    const newPost = {
      title: titleInput.value,
      content: contentInput.value,
      author: authorInput.value,
      category: categoryInput.value
    };
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memposting artikel');
      }
      
      const postedArticle = await response.json();
      showMessage('Artikel berhasil diposting!', 'success');
      postForm.reset(); // Kosongkan form
      authorInput.value = 'Admin Nurul Khalil'; // Set default kembali
      categoryInput.value = 'Umum'; // Set default kembali
      fetchArticles(); // Refresh daftar artikel
    } catch (error) {
      console.error('Error posting article:', error);
      showMessage(`Error: ${error.message}`, 'error');
    }
  });
  
  // --- Fungsi untuk Menampilkan Daftar Artikel ---
  async function fetchArticles() {
    articlesListBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Memuat artikel...</td></tr>';
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const articles = await response.json();
      displayArticles(articles);
    } catch (error) {
      console.error('Error fetching articles for admin:', error);
      articlesListBody.innerHTML = `<tr><td colspan="6" style="color: red; text-align: center;">Gagal memuat daftar artikel: ${error.message}</td></tr>`;
    }
  }
  
  function displayArticles(articles) {
    articlesListBody.innerHTML = ''; // Clear previous content
    if (articles.length === 0) {
      articlesListBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada artikel yang dipublikasikan.</td></tr>';
      return;
    }
    
    articles.forEach((article, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${article.title}</td>
                <td>${article.author}</td>
                <td>${article.category}</td>
                <td>${new Date(article.createdAt).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${article._id}">Edit</button>
                    <button class="delete-btn" data-id="${article._id}">Hapus</button>
                </td>
            `;
      articlesListBody.appendChild(row);
    });
    
    // Add event listeners for Edit and Delete buttons
    articlesListBody.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const articleId = event.target.dataset.id;
        // TODO: Implement edit functionality (e.g., populate form, change submit action)
        alert(`Fitur edit untuk artikel ID: ${articleId} akan dikembangkan.`);
      });
    });
    
    articlesListBody.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const articleId = event.target.dataset.id;
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
          try {
            const response = await fetch(`${API_URL}/${articleId}`, {
              method: 'DELETE'
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus artikel');
            }
            showMessage('Artikel berhasil dihapus!', 'success');
            fetchArticles(); // Refresh daftar artikel
          } catch (error) {
            console.error('Error deleting article:', error);
            showMessage(`Error menghapus: ${error.message}`, 'error');
          }
        }
      });
    });
  }
  
  // Load articles when the page loads
  fetchArticles();
});