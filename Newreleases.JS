const movieCards = document.getElementById('movie-cards');
const newReleasesCards = document.getElementById('new-releases-cards');

// TMDb API configuration
const API_KEY = '5e2b1808421320ec6cf568e30b12b1cf'; // Replace with your TMDb API key
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/`;
const NEW_RELEASES_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch trending movies
async function fetchTrendingMovies(timeWindow = 'day') {
    try {
        const response = await fetch(`${TRENDING_URL}${timeWindow}?api_key=${API_KEY}`);
        const data = await response.json();
        renderTrendingMovies(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

// Render trending movie cards
function renderTrendingMovies(movies) {
    movieCards.innerHTML = ''; // Clear existing cards

    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-thumbnail">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date ? movie.release_date.split('-')[0] : 'Unknown Year'}</p>
                <div class="movie-rating">${Math.round(movie.vote_average * 10)}%</div>
            </div>
        `;
        movieCards.appendChild(card);
    });
}

// Fetch new releases
async function fetchNewReleases() {
    try {
        const response = await fetch(NEW_RELEASES_URL);
        const data = await response.json();
        renderNewReleases(data.results);
    } catch (error) {
        console.error('Error fetching new releases:', error);
    }
}

// Render new release movie cards
function renderNewReleases(movies) {
    newReleasesCards.innerHTML = ''; // Clear existing cards

    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('new-release-card');
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="new-release-thumbnail">
            <div class="new-release-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date ? movie.release_date.split('-')[0] : 'Unknown Year'}</p>
                <p>${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No description available.'}</p>
                <div class="new-release-rating">${Math.round(movie.vote_average * 10)}%</div>
            </div>
        `;
        newReleasesCards.appendChild(card);
    });
}

// Initialize page
function init() {
    fetchTrendingMovies(); // Fetch trending movies for "Today"
    fetchNewReleases(); // Fetch new releases
}

init();