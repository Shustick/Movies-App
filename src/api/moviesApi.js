const API_URL = 'https://api.themoviedb.org/3';
const API_KEY =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjg1ZjE2YTE0NjI2NGFmNzc4MzhiMjY5MDQ2NjU3ZCIsIm5iZiI6MTc0MTg2MjUzMy41MTcsInN1YiI6IjY3ZDJiNjg1YTk3YzY0NmNiNTgxMWZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7-BBckPCTVMd_KbMUvnFiCIynLwvvwPfuPCfcLaavqk';

const optionsGet = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: API_KEY,
  },
};

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
  };
};

async function getFilms(query, currentPage = 1) {
  if (!query.trim()) return { results: [] };

  const res = await fetch(
    `${API_URL}/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`,
    optionsGet
  );
  if (!res.ok) {
    return res;
  }
  return res.json();
}

async function getPopularFilms(currentPage = 1) {
  const res = await fetch(`${API_URL}/movie/top_rated?language=en-US&page=${currentPage}`, optionsGet);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

async function getGenres() {
  const res = await fetch(`${API_URL}/genre/movie/list?language=en`, optionsGet);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

async function getGuestSession() {
  const res = await fetch(`${API_URL}/authentication/guest_session/new`, optionsGet);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

const setGuestSession = async () => {
  const storedId = localStorage.getItem('guest_session_id');
  const expiresAt = localStorage.getItem('guest_session_id__expires_at');

  if (storedId && new Date(expiresAt) > new Date()) return storedId;
  else {
    localStorage.clear();
    const res = await getGuestSession();
    if (res.success) {
      localStorage.setItem('guest_session_id__expires_at', res.expires_at);
      localStorage.setItem('guest_session_id', res.guest_session_id);
      return res.guest_session_id;
    }
  }
};

async function setRatedMovieApi(rating, movieId) {
  const guestSessionId = await setGuestSession();

  const optionsSetRated = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjg1ZjE2YTE0NjI2NGFmNzc4MzhiMjY5MDQ2NjU3ZCIsIm5iZiI6MTc0MTg2MjUzMy41MTcsInN1YiI6IjY3ZDJiNjg1YTk3YzY0NmNiNTgxMWZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7-BBckPCTVMd_KbMUvnFiCIynLwvvwPfuPCfcLaavqk',
    },
    body: JSON.stringify({ value: rating }),
  };

  const res = await fetch(`${API_URL}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`, optionsSetRated);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

async function deleteRatedMovie(movieId) {
  const guestSessionId = await setGuestSession();

  const optionsDelete = {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjg1ZjE2YTE0NjI2NGFmNzc4MzhiMjY5MDQ2NjU3ZCIsIm5iZiI6MTc0MTg2MjUzMy41MTcsInN1YiI6IjY3ZDJiNjg1YTk3YzY0NmNiNTgxMWZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7-BBckPCTVMd_KbMUvnFiCIynLwvvwPfuPCfcLaavqk',
    },
  };

  const res = await fetch(`${API_URL}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`, optionsDelete);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

async function getRatedMovie(currentPage = 1) {
  const guestSessionId = await setGuestSession();

  const res = await fetch(
    `${API_URL}/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${currentPage}&sort_by=created_at.desc`,
    optionsGet
  );
  if (!res.ok) {
    return res;
  }
  return res.json();
}

export const debouncedGetFilms = debounce(getFilms, 400);
export const debouncedGetPopularFilms = debounce(getPopularFilms, 400);
export const debouncedGetRatedMovie = debounce(getRatedMovie, 400);
export { getGenres, setRatedMovieApi, deleteRatedMovie, setGuestSession };
