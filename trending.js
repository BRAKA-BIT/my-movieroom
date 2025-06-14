const movieCards = document.getElementById('movie-cards');

// TMDb API configuration
const API_KEY = '5e2b1808421320ec6cf568e30b12b1cf'; // Replace with your TMDb API key
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch trending movies
async function fetchTrendingMovies(timeWindow = 'day') {
    const response = await fetch(`${TRENDING_URL}${timeWindow}?api_key=${API_KEY}`);
    const data = await response.json();
    renderMovies(data.results);
}

// Render movie cards
function renderMovies(movies) {
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

// Initialize page
fetchTrendingMovies();