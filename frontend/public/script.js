document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts-container');
  const API_URL = 'http://localhost:5000/api/posts'; // Ganti dengan URL backend Anda setelah deploy
  
  async function fetchPosts() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      displayPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      postsContainer.innerHTML = '<p>Maaf, gagal memuat artikel. Silakan coba lagi nanti.</p>';
    }
  }
  
  function displayPosts(posts) {
    postsContainer.innerHTML = ''; // Clear previous content
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>Belum ada artikel yang dipublikasikan.</p>';
      return;
    }
    
    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.classList.add('post-card');
      postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 200)}...</p> <div class="post-meta">
                    Oleh: ${post.author} | Kategori: ${post.category} | Tanggal: ${new Date(post.createdAt).toLocaleDateString()}
                </div>
                <a href="#" data-id="${post._id}" class="read-more">Baca Selengkapnya</a>
            `;
      postsContainer.appendChild(postCard);
    });
    
    // Event listener for "Baca Selengkapnya" (akan mengarah ke halaman detail)
    postsContainer.querySelectorAll('.read-more').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const postId = event.target.dataset.id;
        // Anda bisa membuat halaman detail post terpisah
        // atau modal/popup untuk menampilkan konten lengkap
        alert(`Membuka artikel dengan ID: ${postId}. Fitur ini akan dikembangkan.`);
        // Contoh: window.location.href = `detail.html?id=${postId}`;
      });
    });
  }
  
  fetchPosts();
});