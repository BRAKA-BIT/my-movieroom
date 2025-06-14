const genreDropdown = document.getElementById('genre-dropdown');
const movieCards = document.getElementById('movie-cards');
const videoPlayer = document.getElementById('video-player');
const movieTitle = document.getElementById('movie-title');
const movieGenre = document.getElementById('movie-genre');
const movieYear = document.getElementById('movie-year');
const movieRating = document.getElementById('movie-rating');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

// TMDb API configuration
const API_KEY = '5e2b1808421320ec6cf568e30b12b1cf'; // Replace with your TMDb API key
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

let trendingMovies = [];
let genres = {};

// Fetch genres from TMDb
async function fetchGenres() {
    const response = await fetch(GENRE_URL);
    const data = await response.json();
    genres = data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {});

    // Populate genre dropdown
    Object.values(genres).forEach((genreName) => {
        const option = document.createElement('option');
        option.value = genreName.toLowerCase();
        option.textContent = genreName;
        genreDropdown.appendChild(option);
    });
}

// Fetch trending movies from TMDb
async function fetchTrendingMovies() {
    const response = await fetch(TRENDING_URL);
    const data = await response.json();
    trendingMovies = data.results.map((movie) => ({
        id: movie.id, // TMDb movie ID
        title: movie.title,
        genre: movie.genre_ids.map((id) => genres[id]).join(', '),
        year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
        rating: movie.vote_average,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }));
    renderMovies(trendingMovies);
}

// Watch movie function
function watchMovie(movieId) {
    const tmdbUrl = `https://www.themoviedb.org/movie/${movieId}`;
    window.location.href = tmdbUrl; // Redirect to the TMDb movie page
}

// Render movie cards
function renderMovies(movies) {
    movieCards.innerHTML = ''; // Clear existing cards

    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${movie.thumbnail}" alt="${movie.title}" class="movie-thumbnail">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Year: ${movie.year}</p>
                <p>Rating: ${movie.rating}/10</p>
                <button class="watch-btn" onclick="watchMovie('${movie.id}')">Play</button>
            </div>
        `;
        movieCards.appendChild(card);
    });
}

// Filter movies by genre
genreDropdown.addEventListener('change', (e) => {
    const selectedGenre = e.target.value;
    const filteredMovies = selectedGenre === 'all'
        ? trendingMovies
        : trendingMovies.filter((movie) => movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    renderMovies(filteredMovies);
});

// Search for movies
async function searchMovies(query) {
    const response = await fetch(`${SEARCH_URL}${encodeURIComponent(query)}`);
    const data = await response.json();
    const movies = data.results.map((movie) => ({
        title: movie.title,
        genre: movie.genre_ids.map((id) => genres[id]).join(', ') || 'Unknown',
        year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
        rating: movie.vote_average,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        videoSrc: `https://www.youtube.com/embed/${movie.id}` // Placeholder for video source
    }));
    renderSearchResults(movies);
}

// Render search results
function renderSearchResults(movies) {
    searchResults.innerHTML = ''; // Clear existing results

    if (movies.length === 0) {
        searchResults.innerHTML = '<p>No movies found. Try a different search.</p>';
        return;
    }

    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${movie.thumbnail}" alt="${movie.title}" class="movie-thumbnail">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Year: ${movie.year}</p>
                <p>Rating: ${movie.rating}/10</p>
                <button class="watch-btn" onclick="watchMovie('${movie.title}', '${movie.genre}', '${movie.year}', '${movie.rating}', '${movie.videoSrc}', '${movie.thumbnail}')">Play</button>
            </div>
        `;
        searchResults.appendChild(card);
    });
}

// Handle search button click
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a movie name to search.');
        return;
    }
    searchMovies(query);
});

// Initialize page
async function init() {
    await fetchGenres();
    await fetchTrendingMovies();
}

init();