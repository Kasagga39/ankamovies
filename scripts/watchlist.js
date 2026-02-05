import Watchlist from './watchlist-manager.js';
import ui from './ui.js';
import { navigateToDetails, DOM } from './app.js';

// Create watchlist instance
const watchlist = new Watchlist();

// Load and display watchlist preview
function loadWatchlistPreview() {
    const watchlistGrid = DOM.watchlistGrid;
    if (!watchlistGrid) return;

    const items = watchlist.getAll();

    if (items.length === 0) {
        watchlistGrid.innerHTML = `
            <div class="empty-watchlist">
                <i class="fas fa-bookmark"></i>
                <h3>Your watchlist is empty</h3>
                <p>Start adding movies and shows to keep track of what you want to watch!</p>
            </div>
        `;
        return;
    }

    ui.renderMediaGrid(items, 'movie', watchlistGrid);
}

// Show full watchlist in a modal/new view
function showWatchlist() {
    const items = watchlist.getAll();

    if (items.length === 0) {
        alert('Your watchlist is empty!');
        return;
    }

    // Create a detailed watchlist view
    const watchlistView = document.createElement('div');
    watchlistView.className = 'watchlist-modal';
    watchlistView.innerHTML = `
        <div class="watchlist-content">
            <div class="watchlist-header">
                <h1>My Watchlist (${items.length} items)</h1>
                <button class="close-watchlist">&times;</button>
            </div>
            <div class="grid" id="full-watchlist-grid"></div>
        </div>
    `;

    document.body.appendChild(watchlistView);

    const grid = watchlistView.querySelector('#full-watchlist-grid');
    ui.renderMediaGrid(items, 'movie', grid);

    // Close button
    watchlistView.querySelector('.close-watchlist').addEventListener('click', () => {
        watchlistView.remove();
    });

    // Close on background click
    watchlistView.addEventListener('click', (e) => {
        if (e.target === watchlistView) {
            watchlistView.remove();
        }
    });
}

// Add item to watchlist from details page
function addToWatchlistFromDetails(item) {
    const success = watchlist.addItem(item);
    if (success) {
        showNotification('Added to watchlist!', 'success');
        loadWatchlistPreview();
    } else {
        showNotification('Already in watchlist', 'info');
    }
}

// Remove item from watchlist
function removeFromWatchlist(id, type) {
    const success = watchlist.removeItem(id, type);
    if (success) {
        showNotification('Removed from watchlist', 'info');
        loadWatchlistPreview();
    }
}

// Check if item is in watchlist
function isInWatchlist(id, type) {
    return watchlist.isInWatchlist(id, type);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for use in other modules
export {
    watchlist,
    loadWatchlistPreview,
    showWatchlist,
    addToWatchlistFromDetails,
    removeFromWatchlist,
    isInWatchlist,
    showNotification
};
