import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { searchBooks, getRecommendations, searchByGenre, getBestSellers } from './service/book';

const BookBotApp = () => {
  const [activeScreen, setActiveScreen] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Halo! Saya BookBot, asisten rekomendasi buku Anda yang didukung oleh AI. Saya siap membantu Anda menemukan buku yang sempurna! 📚\n\nAnda bisa bertanya tentang rekomendasi buku, review, atau apapun seputar dunia literasi.',
      timestamp: new Date(),
      books: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    genres: ['fiction', 'fantasy'],
    language: 'en'
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    loadRecommendations();
    loadBestSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecommendations = async () => {
    const books = await getRecommendations(userPreferences.genres);
    setRecommendedBooks(books.slice(0, 12));
  };

  const loadBestSellers = async () => {
    const books = await getBestSellers();
    setBestSellers(books.slice(0, 12));
  };

  const extractGenresFromPreferences = (text) => {
    const genreKeywords = {
      'fiction': ['fiction', 'novel', 'cerita', 'fiksi'],
      'romance': ['romance', 'romantis', 'cinta', 'roman'],
      'mystery': ['mystery', 'misteri', 'detektif', 'detective'],
      'fantasy': ['fantasy', 'fantasi', 'magic', 'sihir'],
      'science fiction': ['sci-fi', 'science fiction', 'fiksi ilmiah', 'scifi'],
      'thriller': ['thriller', 'suspense', 'tegang'],
      'horror': ['horror', 'horor', 'seram', 'hantu'],
      'biography': ['biography', 'biografi', 'memoir', 'autobiografi'],
      'history': ['history', 'sejarah', 'historical'],
      'self-help': ['self-help', 'motivasi', 'pengembangan diri', 'motivational'],
      'business': ['business', 'bisnis', 'entrepreneur', 'startup'],
      'technology': ['technology', 'teknologi', 'programming', 'coding']
    };
    
    const lowerText = text.toLowerCase();
    const foundGenres = [];
    
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        foundGenres.push(genre);
      }
    }
    
    return foundGenres.length > 0 ? foundGenres : ['fiction'];
  };

  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    // Check for search intent
    if (lowerText.includes('cari') || lowerText.includes('search') || 
        lowerText.includes('find') || lowerText.includes('carikan') ||
        lowerText.includes('buku tentang') || lowerText.includes('buku mengenai') ||
        lowerText.includes('book about') || lowerText.includes('buku di bidang') ||
        lowerText.includes('buku yang membahas')) {
      return 'search';
    }
    
    // Check for recommendation intent
    if (lowerText.includes('rekomendasi') || lowerText.includes('rekomendasikan') || 
        lowerText.includes('saran') || lowerText.includes('sarankan') ||
        lowerText.includes('recommend') || lowerText.includes('suggest') ||
        lowerText.includes('usulkan')) {
      return 'recommend';
    }
    
    // Check for genre intent
    if (lowerText.includes('genre') || lowerText.includes('kategori') || 
        lowerText.includes('jenis')) {
      return 'genre';
    }

    // Check for bestseller intent
    if (lowerText.includes('bestseller') || lowerText.includes('populer') ||
        lowerText.includes('terlaris') || lowerText.includes('best seller')) {
      return 'bestseller';
    }
    
    // If contains "buku" + any topic keyword, treat as search
    if (lowerText.includes('buku') || lowerText.includes('book')) {
      return 'search';
    }
    
    return 'general';
  };

  const extractSearchQuery = (text) => {
    let query = text.toLowerCase()
      .replace(/cari buku/gi, '')
      .replace(/carikan buku/gi, '')
      .replace(/buku tentang/gi, '')
      .replace(/buku mengenai/gi, '')
      .replace(/buku di bidang/gi, '')
      .replace(/buku yang membahas/gi, '')
      .replace(/book about/gi, '')
      .replace(/cari/gi, '')
      .replace(/search/gi, '')
      .replace(/find/gi, '')
      .replace(/tentang/gi, '')
      .replace(/mengenai/gi, '')
      .replace(/about/gi, '')
      .replace(/terbaru/gi, '')
      .replace(/buku/gi, '')
      .replace(/book/gi, '')
      .trim();
    
    return query || 'bestseller';
  };

  const handleQuickAction = (query) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(query), 100);
  };

  const handleSendMessage = async (quickQuery = null) => {
    const userInput = quickQuery || inputValue;
    if (!userInput.trim() || loading) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: userInput,
      timestamp: new Date(),
      books: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      const intent = detectIntent(userInput);
      let botResponseText = '';
      let books = [];
      
      console.log('=== DEBUG INFO ===');
      console.log('User input:', userInput);
      console.log('Intent detected:', intent);
      
      if (intent === 'search') {
        const query = extractSearchQuery(userInput);
        console.log('Search query:', query);
        
        books = await searchBooks(query, 8);
        console.log('Books found:', books.length);
        console.log('Books data:', books);
        
        if (books.length > 0) {
          botResponseText = `🔍 Saya menemukan ${books.length} buku tentang "${query}". Berikut adalah hasil pencariannya:`;
        } else {
          botResponseText = `😕 Maaf, tidak ada buku yang ditemukan untuk "${query}". Mungkin coba kata kunci lain atau cek ejaan Anda?`;
        }
      } 
      else if (intent === 'recommend') {
        const genres = extractGenresFromPreferences(userInput);
        books = await getRecommendations(genres);
        
        if (books.length > 0) {
          botResponseText = `💡 Berdasarkan preferensi Anda terhadap genre ${genres.join(', ')}, berikut ${books.length} rekomendasi buku terbaik:`;
        } else {
          botResponseText = `😕 Maaf, tidak ada rekomendasi yang sesuai untuk genre "${genres.join(', ')}". Coba genre lain?`;
        }
      }
      else if (intent === 'genre') {
        const genres = extractGenresFromPreferences(userInput);
        books = await searchByGenre(genres[0], 8);
        
        if (books.length > 0) {
          botResponseText = `📚 Berikut adalah koleksi buku-buku genre ${genres[0]}:`;
        } else {
          botResponseText = `😕 Maaf, tidak ada buku genre "${genres[0]}" yang ditemukan saat ini.`;
        }
      }
      else if (intent === 'bestseller') {
        books = await getBestSellers();
        botResponseText = `🏆 Berikut adalah buku-buku bestseller saat ini:`;
      }
      else {
        botResponseText = `💬 Saya siap membantu! Coba tanyakan tentang genre buku favorit Anda, dan saya akan berikan rekomendasi terbaik!\n\nContoh:\n• "Cari buku tentang startup"\n• "Rekomendasikan buku motivasi"\n• "Buku genre fantasy"\n• "Buku bestseller"`;
      }
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponseText,
        books: books,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: '🔧 Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi dalam beberapa saat.',
        books: [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFavorite = (book) => {
    const isFavorite = favorites.some(fav => fav.id === book.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== book.id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const isFavorite = (bookId) => {
    return favorites.some(fav => fav.id === bookId);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setShowBookModal(false);
    setSelectedBook(null);
  };

  const handleGenrePreference = (genre) => {
    const genres = userPreferences.genres.includes(genre)
      ? userPreferences.genres.filter(g => g !== genre)
      : [...userPreferences.genres, genre];
    
    setUserPreferences({ ...userPreferences, genres });
    loadRecommendations();
  };

  const renderBookCard = (book, showActions = true) => (
    <div key={book.id} className="book-card">
      <div className="book-image-container" onClick={() => openBookModal(book)}>
        <img 
          src={book.image} 
          alt={book.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
          }}
        />
        {showActions && (
          <button 
            className={`favorite-btn ${isFavorite(book.id) ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(book);
            }}
          >
            {isFavorite(book.id) ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="book-info">
        <h3 title={book.title}>{book.title}</h3>
        <p className="author">✍️ {book.author}</p>
        <p className="genre">📚 {book.genre}</p>
        {book.rating > 0 && (
          <p className="rating">⭐ {book.rating.toFixed(1)}/5 ({book.reviews || 0})</p>
        )}
        {book.year && book.year !== 'N/A' && (
          <p className="year">📅 {book.year}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1>📚 BookBot</h1>
          <span className="subtitle">AI-Powered Assistant</span>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="icon-btn" onClick={() => setActiveScreen('favorites')}>
            ❤️ <span className="badge">{favorites.length}</span>
          </button>
          <button className="icon-btn">👤</button>
        </div>
      </header>

      <div className="main-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <button 
              className={activeScreen === 'welcome' ? 'active' : ''}
              onClick={() => setActiveScreen('welcome')}
            >
              🏠 Home
            </button>
            <button 
              className={activeScreen === 'chat' ? 'active' : ''}
              onClick={() => setActiveScreen('chat')}
            >
              💬 Chat AI
            </button>
            <button 
              className={activeScreen === 'recommendations' ? 'active' : ''}
              onClick={() => setActiveScreen('recommendations')}
            >
              ⭐ Rekomendasi
            </button>
            <button 
              className={activeScreen === 'bestsellers' ? 'active' : ''}
              onClick={() => setActiveScreen('bestsellers')}
            >
              🏆 Best Sellers
            </button>
            <button 
              className={activeScreen === 'favorites' ? 'active' : ''}
              onClick={() => setActiveScreen('favorites')}
            >
              ❤️ Favorit ({favorites.length})
            </button>
            <button 
              className={activeScreen === 'profile' ? 'active' : ''}
              onClick={() => setActiveScreen('profile')}
            >
              👤 Profile
            </button>
          </nav>
        </aside>

        <main className="content">
          {activeScreen === 'welcome' && (
            <div className="welcome-screen">
              <div className="welcome-content">
                <h1>Selamat Datang di BookBot! 📚</h1>
                <p>Asisten AI untuk menemukan buku favorit Anda</p>
                <div className="welcome-buttons">
                  <button 
                    className="start-btn"
                    onClick={() => setActiveScreen('chat')}
                  >
                    💬 Mulai Chat
                  </button>
                  <button 
                    className="start-btn secondary"
                    onClick={() => setActiveScreen('recommendations')}
                  >
                    ⭐ Lihat Rekomendasi
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeScreen === 'chat' && (
            <div className="chat-screen">
              <div className="quick-actions">
                <button onClick={() => handleQuickAction('Cari buku bestseller')}>
                  🏆 Bestseller
                </button>
                <button onClick={() => handleQuickAction('Rekomendasikan buku fantasy')}>
                  🧙 Fantasy
                </button>
                <button onClick={() => handleQuickAction('Buku motivasi')}>
                  💪 Motivasi
                </button>
                <button onClick={() => handleQuickAction('Cari buku teknologi')}>
                  💻 Technology
                </button>
              </div>

              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'bot' ? '🤖' : '👤'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      
                      {message.books && message.books.length > 0 && (
                        <div className="books-container">
                          <div className="books-grid">
                            {message.books.map((book) => renderBookCard(book))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="message bot">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content">
                      <div className="message-text loading-text">
                        <span className="loading-dots">Sedang mencari buku</span>
                        <span className="dots">...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanya tentang buku apapun..."
                  disabled={loading}
                />
                <button 
                  onClick={() => handleSendMessage()} 
                  disabled={loading || !inputValue.trim()}
                  className="send-btn"
                >
                  {loading ? '⏳' : '➤'}
                </button>
              </div>
              
              <div className="footer-text">
                Powered by Claude AI & Google Books API
              </div>
            </div>
          )}

          {activeScreen === 'recommendations' && (
            <div className="screen recommendations-screen">
              <h2>⭐ Rekomendasi Untuk Anda</h2>
              <p className="subtitle-text">Berdasarkan preferensi genre Anda</p>
              
              <div className="genre-filters">
                {['fiction', 'fantasy', 'mystery', 'romance', 'biography', 'business'].map(genre => (
                  <button 
                    key={genre}
                    className={`genre-chip ${userPreferences.genres.includes(genre) ? 'active' : ''}`}
                    onClick={() => handleGenrePreference(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="books-grid large">
                {recommendedBooks.map((book) => renderBookCard(book))}
              </div>
            </div>
          )}

          {activeScreen === 'bestsellers' && (
            <div className="screen bestsellers-screen">
              <h2>🏆 Best Sellers</h2>
              <p className="subtitle-text">Buku-buku terlaris saat ini</p>
              
              <div className="books-grid large">
                {bestSellers.map((book) => renderBookCard(book))}
              </div>
            </div>
          )}

          {activeScreen === 'favorites' && (
            <div className="screen favorites-screen">
              <h2>❤️ Buku Favorit Saya</h2>
              <p className="subtitle-text">
                {favorites.length > 0 
                  ? `${favorites.length} buku tersimpan` 
                  : 'Belum ada buku favorit. Tambahkan dari hasil pencarian!'}
              </p>
              
              {favorites.length > 0 ? (
                <div className="books-grid large">
                  {favorites.map((book) => renderBookCard(book))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📚</p>
                  <button 
                    className="start-btn"
                    onClick={() => setActiveScreen('chat')}
                  >
                    Mulai Cari Buku
                  </button>
                </div>
              )}
            </div>
          )}

          {activeScreen === 'profile' && (
            <div className="screen profile-screen">
              <h2>👤 Profile</h2>
              
              <div className="profile-card">
                <div className="profile-avatar">👤</div>
                <h3>Book Lover</h3>
                
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">{favorites.length}</span>
                    <span className="stat-label">Favorit</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{messages.length}</span>
                    <span className="stat-label">Percakapan</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{userPreferences.genres.length}</span>
                    <span className="stat-label">Genre Favorit</span>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Genre Favorit:</h4>
                  <div className="genre-tags">
                    {userPreferences.genres.map(genre => (
                      <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showBookModal && selectedBook && (
        <div className="modal-overlay" onClick={closeBookModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeBookModal}>✕</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedBook.image} alt={selectedBook.title} />
              </div>
              
              <div className="modal-info">
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">✍️ {selectedBook.author}</p>
                
                <div className="modal-meta">
                  <span>📚 {selectedBook.genre}</span>
                  <span>📅 {selectedBook.year}</span>
                  {selectedBook.pages > 0 && <span>📄 {selectedBook.pages} halaman</span>}
                  {selectedBook.rating > 0 && (
                    <span>⭐ {selectedBook.rating.toFixed(1)}/5</span>
                  )}
                </div>

                <div className="modal-description">
                  <h4>Deskripsi:</h4>
                  <p>{selectedBook.description}</p>
                </div>

                <div className="modal-actions">
                  <button 
                    className={`btn-favorite ${isFavorite(selectedBook.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(selectedBook)}
                  >
                    {isFavorite(selectedBook.id) ? '❤️ Hapus dari Favorit' : '🤍 Tambah ke Favorit'}
                  </button>
                  {selectedBook.previewLink && (
                    <a 
                      href={selectedBook.previewLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-preview"
                    >
                      👁️ Preview
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookBotApp;