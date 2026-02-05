import tmdb from './tmdb-api.js';
import watchmode from './watchmode-api.js';
import ui from './ui.js';
import {
    addToWatchlistFromDetails,
    removeFromWatchlist,
    isInWatchlist,
    showNotification
} from './watchlist.js';

// Get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        type: params.get('type') || 'movie'
    };
}

// Initialize details page
async function initDetailsPage() {
    const { id, type } = getQueryParams();

    if (!id) {
        showError('No item specified');
        return;
    }

    try {
        // Fetch details
        const details = await tmdb.getDetails(id, type);

        if (!details) {
            showError('Could not load details');
            return;
        }

        // Display details
        displayDetails(details, type);

        // Fetch streaming availability
        const streamingData = await watchmode.getStreamingAvailability(id, type);
        if (streamingData) {
            displayStreamingInfo(streamingData);
        }

        // Setup buttons
        setupButtons(id, type, details);
    } catch (error) {
        console.error('Error loading details:', error);
        showError('Failed to load movie details');
    }
}

// Display movie/TV details
function displayDetails(details, type) {
    const {
        title,
        name,
        overview,
        poster_path,
        backdrop_path,
        release_date,
        first_air_date,
        runtime,
        episode_run_time,
        genres,
        vote_average,
        tagline,
        credits,
        videos
    } = details;

    const titleText = title || name;
    const releaseDate = release_date || first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const runtimeText = type === 'movie' ? `${runtime} min` : `${episode_run_time?.[0] || 'N/A'} min`;
    const genresText = genres?.map(g => g.name).join(', ') || 'N/A';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

    // Backdrop
    const backdropURL = tmdb.getBackdropURL(backdrop_path);
    const heroSection = document.getElementById('detail-hero');
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${backdropURL}')`;
    }

    // Poster
    const posterImg = document.getElementById('detail-poster');
    if (posterImg) {
        posterImg.src = tmdb.getImageURL(poster_path);
        posterImg.alt = titleText;
    }

    // Title and Meta
    const titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.textContent = titleText;

    const yearEl = document.getElementById('detail-year');
    if (yearEl) yearEl.textContent = year;

    const runtimeEl = document.getElementById('detail-runtime');
    if (runtimeEl) runtimeEl.textContent = runtimeText;

    const genresEl = document.getElementById('detail-genres');
    if (genresEl) genresEl.textContent = genresText;

    const ratingEl = document.getElementById('rating-value');
    if (ratingEl) ratingEl.textContent = rating;

    // Tagline
    const taglineEl = document.getElementById('tagline');
    if (taglineEl) taglineEl.textContent = tagline || '';

    // Overview
    const overviewEl = document.getElementById('overview');
    if (overviewEl) overviewEl.textContent = overview || 'No overview available';

    // Cast
    displayCast(credits?.cast);

    // Crew
    displayCrew(credits?.crew);

    // Recommendations
    displayRecommendations(details.recommendations?.results, type);

    // Hide loading, show content
    const loading = document.getElementById('loading');
    const container = document.getElementById('details-container');
    if (loading) loading.style.display = 'none';
    if (container) container.style.display = 'block';
}

// Display cast
function displayCast(cast) {
    const castGrid = document.getElementById('cast-grid');
    if (!castGrid || !cast || cast.length === 0) return;

    const castHTML = cast.slice(0, 6).map(actor => {
        const profileURL = actor.profile_path
            ? tmdb.getImageURL(actor.profile_path, 'w500')
            : 'https://via.placeholder.com/150x225?text=No+Image';

        return `
            <div class="cast-member">
                <img src="${profileURL}" alt="${actor.name}">
                <h4>${actor.name}</h4>
                <p class="character">${actor.character || 'N/A'}</p>
            </div>
        `;
    }).join('');

    castGrid.innerHTML = castHTML;
}

// Display crew
function displayCrew(crew) {
    const crewList = document.getElementById('crew-list');
    if (!crewList || !crew || crew.length === 0) return;

    // Get director, writers, etc.
    const crewByRole = {};
    crew.forEach(member => {
        if (!crewByRole[member.job]) {
            crewByRole[member.job] = [];
        }
        crewByRole[member.job].push(member.name);
    });

    const crewHTML = Object.entries(crewByRole)
        .slice(0, 5)
        .map(([job, names]) => `
            <div class="crew-item">
                <strong>${job}</strong>
                <p>${names.join(', ')}</p>
            </div>
        `)
        .join('');

    crewList.innerHTML = crewHTML;
}

// Display recommendations
function displayRecommendations(recommendations, type) {
    const grid = document.getElementById('recommendations-grid');
    if (!grid || !recommendations || recommendations.length === 0) {
        if (grid) grid.innerHTML = '<p>No recommendations available</p>';
        return;
    }

    ui.renderMediaGrid(recommendations, type, grid);
}

// Display streaming info
function displayStreamingInfo(data) {
    const streamingSection = document.getElementById('streaming-services');
    const streamingNote = document.getElementById('streaming-note');

    if (!streamingSection) return;

    if (!data || !data.sources) {
        streamingSection.innerHTML = '<p>Streaming info not available</p>';
        return;
    }

    const sourcesByType = {};
    data.sources.forEach(source => {
        if (!sourcesByType[source.type]) {
            sourcesByType[source.type] = [];
        }
        sourcesByType[source.type].push(source);
    });

    let html = '';

    if (sourcesByType.subscription) {
        html += '<div class="streaming-type"><strong>Stream On:</strong>';
        sourcesByType.subscription.forEach(source => {
            html += `<span class="service-badge">${source.name}</span>`;
        });
        html += '</div>';
    }

    if (sourcesByType.rent) {
        html += '<div class="streaming-type"><strong>Rent:</strong>';
        sourcesByType.rent.forEach(source => {
            html += `<span class="service-badge">${source.name}</span>`;
        });
        html += '</div>';
    }

    if (sourcesByType.buy) {
        html += '<div class="streaming-type"><strong>Buy:</strong>';
        sourcesByType.buy.forEach(source => {
            html += `<span class="service-badge">${source.name}</span>`;
        });
        html += '</div>';
    }

    streamingSection.innerHTML = html || '<p>Not currently available for streaming</p>';

    if (streamingNote && !html) {
        streamingNote.textContent = 'Check back soon for streaming availability';
    }
}

// Setup action buttons
function setupButtons(id, type, details) {
    const watchlistBtn = document.getElementById('add-to-watchlist');
    const trailerBtn = document.getElementById('watch-trailer');

    const titleText = details.title || details.name;
    const item = {
        id,
        type,
        title: titleText,
        poster_path: details.poster_path,
        vote_average: details.vote_average
    };

    // Watchlist button
    if (watchlistBtn) {
        const updateWatchlistBtn = () => {
            if (isInWatchlist(id, type)) {
                watchlistBtn.textContent = '✓ In Watchlist';
                watchlistBtn.classList.add('in-watchlist');
            } else {
                watchlistBtn.textContent = '+ Add to Watchlist';
                watchlistBtn.classList.remove('in-watchlist');
            }
        };

        updateWatchlistBtn();

        watchlistBtn.addEventListener('click', () => {
            if (isInWatchlist(id, type)) {
                removeFromWatchlist(id, type);
            } else {
                addToWatchlistFromDetails(item);
            }
            updateWatchlistBtn();
        });
    }

    // Trailer button
    if (trailerBtn) {
        const trailer = details.videos?.results?.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
        );

        if (trailer) {
            trailerBtn.addEventListener('click', () => {
                showTrailer(trailer.key);
            });
        } else {
            trailerBtn.style.display = 'none';
        }
    }
}

// Show trailer modal
function showTrailer(videoKey) {
    const modal = document.getElementById('trailer-modal');
    const videoContainer = document.getElementById('video-container');

    if (modal && videoContainer) {
        videoContainer.innerHTML = `
            <iframe width="100%" height="600" 
                    src="https://www.youtube.com/embed/${videoKey}?autoplay=1" 
                    frameborder="0" 
                    allowfullscreen></iframe>
        `;
        modal.style.display = 'flex';

        // Close button
        const closeBtn = document.getElementById('close-trailer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                videoContainer.innerHTML = '';
            });
        }

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                videoContainer.innerHTML = '';
            }
        });
    }
}

// Show error
function showError(message) {
    const container = document.getElementById('details-container');
    const loading = document.getElementById('loading');

    if (loading) loading.style.display = 'none';
    if (container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.history.back()">
                    Go Back
                </button>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDetailsPage);

export { initDetailsPage };
