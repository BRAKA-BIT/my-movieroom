const tvshowsCards = document.getElementById('tvshows-cards');

// TMDb API configuration
const API_KEY = '5e2b1808421320ec6cf568e30b12b1cf'; // Replace with your TMDb API key
const TVSHOWS_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch TV shows
async function fetchTVShows() {
    try {
        const response = await fetch(TVSHOWS_URL);
        const data = await response.json();
        renderTVShows(data.results);
    } catch (error) {
        console.error('Error fetching TV shows:', error);
    }
}

// Render TV show cards
function renderTVShows(tvshows) {
    tvshowsCards.innerHTML = ''; // Clear existing cards

    tvshows.forEach((tvshow) => {
        const card = document.createElement('div');
        card.classList.add('tvshow-card');
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL}${tvshow.poster_path}" alt="${tvshow.name}" class="tvshow-thumbnail">
            <div class="tvshow-info">
                <h3>${tvshow.name}</h3>
                <p>${tvshow.first_air_date ? tvshow.first_air_date.split('-')[0] : 'Unknown Year'}</p>
                <p>${tvshow.overview ? tvshow.overview.slice(0, 100) + '...' : 'No description available.'}</p>
                <div class="tvshow-rating">${Math.round(tvshow.vote_average * 10)}%</div>
                <button class="download-btn" onclick="redirectToTMDb('${tvshow.id}')">
                    <img src="assets/download-icon.png" alt="Download Icon" class="download-icon"> Download
                </button>
            </div>
        `;
        tvshowsCards.appendChild(card);
    });
}

// Redirect to TMDb for download or streaming
function redirectToTMDb(tvshowId) {
    const tmdbUrl = `https://www.themoviedb.org/tv/${tvshowId}`;
    window.open(tmdbUrl, '_blank'); // Open TMDb page in a new tab
}

// Initialize page
fetchTVShows();