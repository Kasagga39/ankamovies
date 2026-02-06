// Main app configuration
const CONFIG = {
    TMDB_API_KEY: 'e11c4d81202033837b62fdc66f146610', 
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'w1280',
    WATCHMODE_API_KEY: '0W5SJMWqcDFRKQdWDl5tifrcxGWOXpaIsQv4lFGO' 
};

// State management
let appState = {
    currentPage: 1,
    totalPages: 1,
    currentFilters: {
        genre: '',
        year: '',
        type: 'movie',
        sortBy: 'popularity.desc'
    },
    searchQuery: '',
    isLoading: false
};

// DOM Elements
const DOM = {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    moviesGrid: document.getElementById('movies-grid'),
    genreFilter: document.getElementById('genre-filter'),
    yearFilter: document.getElementById('year-filter'),
    typeFilter: document.getElementById('type-filter'),
    sortBy: document.getElementById('sort-by'),
    trendingCarousel: document.getElementById('trending-carousel'),
    watchlistSection: document.getElementById('watchlist-section'),
    watchlistGrid: document.getElementById('watchlist-grid')
};

// Initialize app
async function initApp() {
    console.log('Initializing ANKA App...');

    // Load trending movies for carousel
    await loadTrendingMovies();

    // Load popular movies for grid
    await loadPopularMovies();

    // Load filters
    await loadFilters();

    // Load watchlist preview
    loadWatchlistPreview();

    // Set up event listeners
    setupEventListeners();

    console.log('App initialized successfully!');
}

// Event Listeners Setup
function setupEventListeners() {
    // Search
    if (DOM.searchBtn) {
        DOM.searchBtn.addEventListener('click', handleSearch);
    }

    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Filters
    if (DOM.genreFilter) {
        DOM.genreFilter.addEventListener('change', handleFilterChange);
    }

    if (DOM.yearFilter) {
        DOM.yearFilter.addEventListener('change', handleFilterChange);
    }

    if (DOM.typeFilter) {
        DOM.typeFilter.addEventListener('change', handleFilterChange);
    }

    if (DOM.sortBy) {
        DOM.sortBy.addEventListener('change', handleFilterChange);
    }

    // Watchlist link
    const watchlistLink = document.getElementById('watchlist-link');
    if (watchlistLink) {
        watchlistLink.addEventListener('click', (e) => {
            e.preventDefault();
            showWatchlist();
        });
    }
}

// Handle search
async function handleSearch() {
    const query = DOM.searchInput.value.trim();
    if (query) {
        appState.searchQuery = query;
        await searchMovies(query);
    }
}

// Handle filter changes
async function handleFilterChange() {
    appState.currentFilters = {
        genre: DOM.genreFilter.value,
        year: DOM.yearFilter.value,
        type: DOM.typeFilter.value,
        sortBy: DOM.sortBy.value
    };

    appState.currentPage = 1;
    await loadFilteredMovies();
}

// Load trending movies for carousel
async function loadTrendingMovies() {
    try {
        const tmdbAPI = (await import('./tmdb-api.js')).default;
        const uiModule = (await import('./ui.js')).default;
        const data = await tmdbAPI.getTrending('all', 'week');
        if (DOM.trendingCarousel && data) {
            uiModule.renderCarousel(data, DOM.trendingCarousel);
        }
    } catch (error) {
        console.error('Error loading trending movies:', error);
    }
}

// Load popular movies
async function loadPopularMovies() {
    try {
        const tmdbAPI = (await import('./tmdb-api.js')).default;
        const uiModule = (await import('./ui.js')).default;
        const data = await tmdbAPI.getPopular('movie', 1);
        if (DOM.moviesGrid && data) {
            uiModule.renderMediaGrid(data.results, 'movie', DOM.moviesGrid);
        }
    } catch (error) {
        console.error('Error loading popular movies:', error);
        showError(DOM.moviesGrid, 'Failed to load movies');
    }
}

// Load filtered movies
async function loadFilteredMovies() {
    try {
        if (!DOM.moviesGrid) return;
        showLoading(DOM.moviesGrid);

        const tmdbAPI = (await import('./tmdb-api.js')).default;
        const uiModule = (await import('./ui.js')).default;

        const data = await tmdbAPI.getFiltered(appState.currentFilters);
        if (data) {
            uiModule.renderMediaGrid(data.results, appState.currentFilters.type, DOM.moviesGrid);
        }
    } catch (error) {
        console.error('Error loading filtered movies:', error);
        showError(DOM.moviesGrid, 'Failed to load movies');
    }
}

// Search movies
async function searchMovies(query) {
    try {
        if (!DOM.moviesGrid) return;
        showLoading(DOM.moviesGrid);

        const tmdbAPI = (await import('./tmdb-api.js')).default;
        const uiModule = (await import('./ui.js')).default;

        const data = await tmdbAPI.search(query);

        // Filter to only movies and TV shows
        const filtered = data.results.filter(item =>
            item.media_type === 'movie' || item.media_type === 'tv'
        );

        if (filtered.length === 0) {
            DOM.moviesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            `;
            return;
        }

        // Display results
        const grid = document.createElement('div');
        grid.className = 'grid';
        DOM.moviesGrid.parentElement.replaceChild(grid, DOM.moviesGrid);

        filtered.forEach(item => {
            const html = uiModule.renderMediaCard(item, item.media_type);
            grid.innerHTML += html;
        });

        DOM.moviesGrid = grid;
        setupMovieCardListeners();
    } catch (error) {
        console.error('Error searching movies:', error);
        showError(DOM.moviesGrid, 'Failed to search movies');
    }
}

// Load filter options
async function loadFilters() {
    try {
        const tmdbAPI = (await import('./tmdb-api.js')).default;
        const uiModule = (await import('./ui.js')).default;

        const genres = await tmdbAPI.getGenres('movie');
        if (DOM.genreFilter && genres) {
            uiModule.renderGenreFilter(genres.genres, DOM.genreFilter);
        }

        if (DOM.yearFilter) {
            uiModule.renderYearFilter(DOM.yearFilter);
        }
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

// Load watchlist preview
function loadWatchlistPreview() {
    try {
        const watchlistModule = import('./watchlist.js');
        watchlistModule.then(module => {
            module.loadWatchlistPreview();
        });
    } catch (error) {
        console.error('Error loading watchlist:', error);
    }
}

// Show watchlist
function showWatchlist() {
    try {
        const watchlistModule = import('./watchlist.js');
        watchlistModule.then(module => {
            module.showWatchlist();
        });
    } catch (error) {
        console.error('Error showing watchlist:', error);
    }
}

// Setup movie card listeners
function setupMovieCardListeners() {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const type = card.dataset.type;
            navigateToDetails(id, type);
        });
    });
}

// Show loading state
function showLoading(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `;
}

// Show error state
function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                Try Again
            </button>
        </div>
    `;
}

// Navigate to details page
function navigateToDetails(movieId, mediaType = 'movie') {
    window.location.href = `details.html?id=${movieId}&type=${mediaType}`;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for other modules
export { CONFIG, appState, DOM, navigateToDetails, showLoading, showError };