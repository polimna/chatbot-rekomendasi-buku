import React, { useState, useRef, useEffect } from 'react';
import { Send, Book, Menu, User, Star, X, Home, MessageSquare, BookMarked, UserCircle, Loader, Search, Filter, Edit, Heart, Trash2, Plus } from 'lucide-react';

const BookBotApp = () => {
  const [activeScreen, setActiveScreen] = useState('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Halo! Saya BookBot, asisten rekomendasi buku Anda yang didukung oleh AI. Saya siap membantu Anda menemukan buku yang sempurna! 📚\n\nAnda bisa bertanya tentang rekomendasi buku, review, atau apapun seputar dunia literasi.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua Genre');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Pembaca Buku',
    email: 'bookworm@email.com',
    booksRead: 24,
    reviewsWritten: 12,
    wishlist: 8
  });
  const [wishlist, setWishlist] = useState([1, 3, 5]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickReplies = [
    'Rekomendasikan buku fiksi ilmiah terbaik',
    'Buku best seller tahun ini',
    'Novel romantis yang recommended',
    'Buku pengembangan diri untuk pemula',
    'Cerita fantasi yang seru'
  ];

  const bookRecommendations = [
    {
      id: 1,
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Fiksi Ilmiah',
      rating: 4.8,
      year: 1965,
      description: 'Epik fiksi ilmiah tentang politik, agama, dan ekologi di planet gurun Arrakis. Mengikuti kisah Paul Atreides yang harus bertahan hidup di planet berbahaya sambil menghadapi intrik politik yang kompleks.',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      longDescription: 'Dune adalah masterpiece fiksi ilmiah yang mengeksplorasi tema-tema kompleks seperti politik, agama, ekologi, dan takdir manusia. Novel ini bercerita tentang Paul Atreides, pewaris House Atreides yang dipaksa pindah ke planet Arrakis (Dune) - satu-satunya sumber spice melange, substansi paling berharga di alam semesta.'
    },
    {
      id: 2,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasi',
      rating: 4.9,
      year: 1937,
      description: 'Petualangan Bilbo Baggins yang mengubah hidupnya selamanya. Sebuah kisah tentang keberanian, persahabatan, dan menemukan kekuatan dalam diri sendiri.',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
      longDescription: 'The Hobbit mengisahkan petualangan Bilbo Baggins, seorang hobbit yang nyaman dengan kehidupan tenangnya, yang tiba-tiba terseret dalam petualangan epik bersama sekelompok kurcaci dan penyihir Gandalf untuk merebut kembali harta karun dari naga Smaug.'
    },
    {
      id: 3,
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self-Help',
      rating: 4.7,
      year: 2018,
      description: 'Panduan praktis untuk membentuk kebiasaan baik dan menghilangkan kebiasaan buruk. Berdasarkan penelitian ilmiah tentang bagaimana kebiasaan terbentuk.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      longDescription: 'Atomic Habits mengajarkan bahwa perubahan kecil dapat memberikan hasil yang luar biasa. James Clear menjelaskan bagaimana kebiasaan bekerja dan menyajikan strategi praktis untuk membentuk kebiasaan baik yang akan bertahan selamanya.'
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      rating: 4.6,
      year: 1813,
      description: 'Kisah klasik tentang cinta, kesalahpahaman, dan pertumbuhan pribadi. Mengikuti Elizabeth Bennet dalam perjalanannya menemukan cinta sejati.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      longDescription: 'Pride and Prejudice adalah novel romance klasik yang mengisahkan Elizabeth Bennet dan Mr. Darcy. Novel ini mengeksplorasi tema prasangka, kelas sosial, dan bagaimana kesan pertama bisa menyesatkan.'
    },
    {
      id: 5,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'Non-Fiksi',
      rating: 4.8,
      year: 2011,
      description: 'Sejarah singkat umat manusia dari zaman batu hingga era modern. Mengeksplorasi bagaimana Homo sapiens menjadi spesies dominan di planet ini.',
      image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=600&fit=crop',
      longDescription: 'Sapiens membawa pembaca dalam perjalanan melalui sejarah manusia, dari evolusi kognitif hingga revolusi pertanian dan ilmiah. Harari mengajukan pertanyaan besar tentang arti menjadi manusia dan masa depan spesies kita.'
    },
    {
      id: 6,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      genre: 'Fiksi',
      rating: 4.5,
      year: 2020,
      description: 'Tentang pilihan hidup dan kemungkinan-kemungkinan yang ada. Sebuah perpustakaan yang berisi semua versi kehidupan yang berbeda dari pilihan yang kita buat.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
      longDescription: 'The Midnight Library adalah novel filosofis tentang penyesalan, pilihan, dan mencari makna hidup. Nora Seed menemukan dirinya di perpustakaan ajaib di antara hidup dan mati, di mana setiap buku adalah kehidupan berbeda yang bisa dia jalani.'
    }
  ];

  const callClaudeAPI = async (userMessage) => {
    try {
      const systemPrompt = `Anda adalah BookBot, asisten rekomendasi buku yang ramah dan berpengetahuan luas. 

TUGAS ANDA:
- Memberikan rekomendasi buku yang personal dan thoughtful
- Menjelaskan mengapa buku tertentu cocok untuk pengguna
- Berbagi insight tentang plot, tema, dan gaya penulisan
- Membandingkan buku-buku yang serupa
- Membantu pengguna menemukan buku berdasarkan mood, genre, atau preferensi mereka

GAYA KOMUNIKASI:
- Ramah, antusias, dan conversational
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup
- Berikan penjelasan yang cukup detail tapi tidak bertele-tele
- Tanyakan follow-up questions untuk memahami preferensi pengguna lebih baik

CATATAN:
- Jika pengguna bertanya tentang buku yang sangat obscure atau baru, akui jika Anda tidak familiar
- Selalu tawarkan alternatif jika buku yang diminta tidak tersedia
- Berikan 2-3 rekomendasi, bukan terlalu banyak agar tidak overwhelming
`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: "user", content: userMessage }
          ],
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return "Maaf, saya mengalami kendala teknis. Tapi saya tetap bisa membantu! Coba tanyakan tentang genre buku favorit Anda, dan saya akan berikan rekomendasi terbaik. 📚";
    }
  };

  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const newHistory = [
      ...conversationHistory,
      { role: "user", content: text }
    ];

    try {
      const botResponseText = await callClaudeAPI(text);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      
      setConversationHistory([
        ...newHistory,
        { role: "assistant", content: botResponseText }
      ]);
      
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: "Maaf, terjadi kesalahan. Silakan coba lagi!",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleWishlist = (bookId) => {
    if (wishlist.includes(bookId)) {
      setWishlist(wishlist.filter(id => id !== bookId));
      setUserProfile({...userProfile, wishlist: userProfile.wishlist - 1});
    } else {
      setWishlist([...wishlist, bookId]);
      setUserProfile({...userProfile, wishlist: userProfile.wishlist + 1});
    }
  };

  const filteredBooks = bookRecommendations.filter(book => {
    const matchesFilter = activeFilter === 'Semua Genre' || book.genre === activeFilter;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const WelcomeScreen = () => (
    <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full mb-6 shadow-lg animate-pulse">
          <Book className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-gray-800">Selamat Datang di BookBot!</h1>
        <p className="text-xl text-gray-600 mb-4">Asisten AI untuk menemukan buku yang sempurna</p>
        <p className="text-sm text-gray-500 mb-8">Powered by Claude AI 🤖</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <button 
            onClick={() => setActiveScreen('chat')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookMarked className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">Rekomendasi cerdas menggunakan teknologi AI terkini</p>
          </button>
          <button 
            onClick={() => setActiveScreen('chat')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Chat Natural</h3>
            <p className="text-sm text-gray-600">Ngobrol seperti dengan teman yang paham buku</p>
          </button>
          <button 
            onClick={() => setActiveScreen('recommendation')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Personal</h3>
            <p className="text-sm text-gray-600">Saran yang disesuaikan dengan selera Anda</p>
          </button>
        </div>

        <button 
          onClick={() => setActiveScreen('chat')}
          className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          Mulai Chat dengan AI 🚀
        </button>
      </div>
    </div>
  );

  const ChatScreen = () => (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto p-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 mb-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
            {message.type === 'bot' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Book className="w-6 h-6 text-white" />
              </div>
            )}
            <div className={`flex-1 ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
              <div className={`max-w-2xl rounded-2xl p-4 ${
                message.type === 'bot' 
                  ? 'bg-white shadow-md border border-gray-100' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</p>
            </div>
            {message.type === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">💡 Coba tanya:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(reply)}
                className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md">
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            disabled={isTyping}
            placeholder={isTyping ? "AI sedang berpikir..." : "Tanya tentang buku apapun..."}
            className="flex-1 border-2 border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:border-blue-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isTyping ? <Loader className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">Powered by Claude AI</p>
      </div>
    </div>
  );

  const RecommendationScreen = () => (
    <div className="h-full overflow-auto p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Rekomendasi Buku untuk Anda</h2>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <p className="font-semibold text-gray-700">Filter:</p>
            {['Semua Genre', 'Fiksi Ilmiah', 'Fantasi', 'Self-Help', 'Romance', 'Non-Fiksi', 'Fiksi'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                }`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(book.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                  <Heart className={`w-5 h-5 ${wishlist.includes(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({book.rating})</span>
                </div>
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  {book.genre}
                </span>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{book.description}</p>
                <button 
                  onClick={() => setSelectedBook(book)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Tidak ada buku yang ditemukan</p>
            <p className="text-gray-500 text-sm">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBook(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedBook.image} 
                alt={selectedBook.title}
                className="w-full h-64 object-cover"
              />
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">{selectedBook.title}</h2>
              <p className="text-lg text-gray-600 mb-4">oleh {selectedBook.author}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.floor(selectedBook.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({selectedBook.rating})</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedBook.genre}
                </span>
                <span className="text-gray-600 text-sm">Tahun: {selectedBook.year}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{selectedBook.longDescription}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => toggleWishlist(selectedBook.id)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    wishlist.includes(selectedBook.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <Heart className={`w-5 h-5 inline mr-2 ${wishlist.includes(selectedBook.id) ? 'fill-current' : ''}`} />
                  {wishlist.includes(selectedBook.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                </button>
                <button 
                  onClick={() => {
                    setSelectedBook(null);
                    setActiveScreen('chat');
                    handleSendMessage(`Ceritakan lebih banyak tentang buku ${selectedBook.title} oleh ${selectedBook.author}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Tanya AI tentang buku ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ProfileScreen = () => (
    <div className="h-full overflow-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full text-2xl font-bold border-b-2 border-blue-600 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full text-gray-600 border-b-2 border-blue-600 focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                </>
              )}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {isEditing ? 'Simpan' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
            <button 
              onClick={() => setActiveScreen('recommendation')}
              className="text-center hover:bg-blue-50 rounded-lg p-3 transition-colors">
              <p className="text-3xl font-bold text-blue-600">{userProfile.booksRead}</p>
              <p className="text-sm text-gray-600">Buku Dibaca</p>
            </button>
            <div className="text-center hover:bg-blue-50 rounded-lg p-3 transition-colors cursor-pointer">
              <p className="text-3xl font-bold text-blue-600">{userProfile.reviewsWritten}</p>
              <p className="text-sm text-gray-600">Review Ditulis</p>
            </div>
            <button 
              onClick={() => {
                setActiveScreen('recommendation');
                setActiveFilter('Semua Genre');
              }}
              className="text-center hover:bg-blue-50 rounded-lg p-3 transition-colors">
              <p className="text-3xl font-bold text-blue-600">{userProfile.wishlist}</p>
              <p className="text-sm text-gray-600">Wishlist</p>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Preferensi Genre</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Tambah Genre
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Fiksi Ilmiah', 'Fantasi', 'Misteri', 'Romance', 'Self-Help'].map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setActiveScreen('recommendation');
                  setActiveFilter(genre);
                }}
                className="group relative bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Wishlist Saya ({wishlist.length})</h3>
            <button 
              onClick={() => setActiveScreen('recommendation')}
              className="text-blue-600 hover:text-blue-700 text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {bookRecommendations.filter(book => wishlist.includes(book.id)).slice(0, 3).map((book) => (
              <div key={book.id} className="flex gap-4 items-center border-b border-gray-200 pb-3 last:border-b-0 group">
                <button
                  onClick={() => setSelectedBook(book)}
                  className="w-16 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1">
                  <h4 className="font-semibold hover:text-blue-600 cursor-pointer" onClick={() => setSelectedBook(book)}>
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3 h-3 ${star <= Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toggleWishlist(book.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          {wishlist.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Belum ada buku di wishlist</p>
              <button 
                onClick={() => setActiveScreen('recommendation')}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                Jelajahi Buku
              </button>
            </div>
          )}
        </div>

        {/* Reading History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Riwayat Bacaan</h3>
          <div className="space-y-4">
            {bookRecommendations.slice(0, 3).map((book) => (
              <div key={book.id} className="flex gap-4 items-center border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer" onClick={() => setSelectedBook(book)}>
                <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 shadow-sm">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3 h-3 ${star <= Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">Des 2024</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Detail Modal (reuse from RecommendationScreen) */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBook(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedBook.image} 
                alt={selectedBook.title}
                className="w-full h-64 object-cover"
              />
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">{selectedBook.title}</h2>
              <p className="text-lg text-gray-600 mb-4">oleh {selectedBook.author}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.floor(selectedBook.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({selectedBook.rating})</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedBook.genre}
                </span>
                <span className="text-gray-600 text-sm">Tahun: {selectedBook.year}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{selectedBook.longDescription}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => toggleWishlist(selectedBook.id)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    wishlist.includes(selectedBook.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <Heart className={`w-5 h-5 inline mr-2 ${wishlist.includes(selectedBook.id) ? 'fill-current' : ''}`} />
                  {wishlist.includes(selectedBook.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                </button>
                <button 
                  onClick={() => {
                    setSelectedBook(null);
                    setActiveScreen('chat');
                    handleSendMessage(`Ceritakan lebih banyak tentang buku ${selectedBook.title} oleh ${selectedBook.author}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Tanya AI tentang buku ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-64 bg-white border-r border-gray-200 h-full transition-transform duration-300 shadow-lg`}>
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="w-7 h-7 text-white" />
              <h1 className="font-bold text-xl text-white">BookBot</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-blue-100 mt-1">AI-Powered Assistant</p>
        </div>
        
        <nav className="p-4">
          <button 
            onClick={() => { setActiveScreen('welcome'); setSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
              activeScreen === 'welcome' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
            }`}>
            <Home className="w-5 h-5" />
            Welcome
          </button>
          <button 
            onClick={() => { setActiveScreen('chat'); setSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
              activeScreen === 'chat' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
            }`}>
            <MessageSquare className="w-5 h-5" />
            Chat AI
          </button>
          <button 
            onClick={() => { setActiveScreen('recommendation'); setSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
              activeScreen === 'recommendation' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
            }`}>
            <BookMarked className="w-5 h-5" />
            Rekomendasi
          </button>
          <button 
            onClick={() => { setActiveScreen('profile'); setSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
              activeScreen === 'profile' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
            }`}>
            <UserCircle className="w-5 h-5" />
            Profile
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden hover:bg-gray-100 p-2 rounded">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-semibold text-xl text-gray-800">
              {activeScreen === 'welcome' && '🏠 Welcome'}
              {activeScreen === 'chat' && '🤖 Chat AI'}
              {activeScreen === 'recommendation' && '📚 Rekomendasi Buku'}
              {activeScreen === 'profile' && '👤 Profile'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Claude AI
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {activeScreen === 'welcome' && <WelcomeScreen />}
          {activeScreen === 'chat' && <ChatScreen />}
          {activeScreen === 'recommendation' && <RecommendationScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
        </div>
      </div>
    </div>
  );
};

export default BookBotApp;