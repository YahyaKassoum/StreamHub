const API_KEY = import.meta.env.VITE_APIKEY;
const BASE_URL = import.meta.env.VITE_BASEURL


export const fetchTrending = async (mediaType: 'movie' | 'tv' | 'all' = 'all', page = 1, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}&page=${page}&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchPopular = async (mediaType: 'movie' | 'tv', page = 1, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${page}&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchTopRated = async (mediaType: 'movie' | 'tv', page = 1, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}&page=${page}&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchByGenre = async (mediaType: 'movie' | 'tv', genreId: number, page = 1, language = "en-US") => {
  const response = await fetch(
    `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchDetails = async (mediaType: 'movie' | 'tv', id: string, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=external_ids,similar&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchSeasonDetails = async (tvId: string, seasonNumber: number, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data;
};

export const fetchGenres = async (mediaType: 'movie' | 'tv', language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data.genres;
};

export const fetchAnime = async (page = 1, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/discover/tv?` + 
    new URLSearchParams({
      api_key: API_KEY,
      with_genres: '16', // Animation genre
      with_original_language: 'ja', // Japanese content
      page: page.toString(),
      language: language,
      sort_by: 'popularity.desc',
      'vote_average.gte': '7', // Minimum rating of 7
      'first_air_date.gte': '2020-01-01', // Recent anime (last ~4 years)
      with_keywords: '210024|287501', // Anime keywords
    })
  );
  const data = await response.json();
  return data;
};

export const searchMedia = async (query: string, page = 1, language = 'en-US') => {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=${language}`
  );
  const data = await response.json();
  return data;
};

// Add this new function to fetch similar content with better filters
export const fetchSimilarContent = async (
  mediaType: 'movie' | 'tv',
  id: string,
  genres: number[],
  year: number,
  language = 'en-US'
) => {
  // Build query parameters for better matching
  const genreIds = genres.join(',');
  const startDate = `${year-1}-01-01`;
  const endDate = `${year+2}-12-31`;
  
  const response = await fetch(
    `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&vote_average.gte=6&with_genres=${genreIds}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=1`
  );
  const data = await response.json();
  return data;
};