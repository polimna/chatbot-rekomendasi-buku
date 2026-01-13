const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
export const searchBooks = async (query, maxResults = 20) => {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=id,en&orderBy=relevance`
    );
    const data = await response.json();
    
    if (!data.items) return [];
    
    return data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'Untitled',
      author: item.volumeInfo.authors?.join(', ') || 'Unknown',
      genre: item.volumeInfo.categories?.[0] || 'General',
      rating: item.volumeInfo.averageRating || 0,
      year: item.volumeInfo.publishedDate?.split('-')[0] || 'N/A',
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || 'N/A',
      pages: item.volumeInfo.pageCount || 0,
      language: item.volumeInfo.language || 'en',
      publisher: item.volumeInfo.publisher || 'Unknown',
      description: item.volumeInfo.description || 'No description available',
      image: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/400x600?text=No+Cover',
      previewLink: item.volumeInfo.previewLink || '',
      infoLink: item.volumeInfo.infoLink || '',
      reviews: item.volumeInfo.ratingsCount || 0
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}/${bookId}`);
    const item = await response.json();
    
    return {
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.join(', '),
      genre: item.volumeInfo.categories?.[0],
      rating: item.volumeInfo.averageRating,
      year: item.volumeInfo.publishedDate?.split('-')[0],
      description: item.volumeInfo.description,
      longDescription: item.volumeInfo.description,
      image: item.volumeInfo.imageLinks?.large || item.volumeInfo.imageLinks?.thumbnail,
      pages: item.volumeInfo.pageCount,
      publisher: item.volumeInfo.publisher,
      language: item.volumeInfo.language,
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

export const searchByGenre = async (genre, maxResults = 20) => {
  return searchBooks(`subject:${genre}`, maxResults);
};

export const getBestSellers = async () => {
  return searchBooks('best sellers', 30);
};

export const getRecommendations = async (preferences) => {
  const genres = preferences.join('+OR+');
  return searchBooks(`subject:(${genres})`, 20);
};