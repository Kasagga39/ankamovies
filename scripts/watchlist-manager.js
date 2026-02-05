class Watchlist {
    constructor() {
        this.storageKey = 'ANKA_watchlist';
        this.watchlist = this.loadFromStorage();
    }

    // Load watchlist from localStorage
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading watchlist:', error);
            return [];
        }
    }

    // Save watchlist to localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.watchlist));
        } catch (error) {
            console.error('Error saving watchlist:', error);
        }
    }

    // Add item to watchlist
    addItem(item) {
        if (!this.isInWatchlist(item.id, item.type)) {
            this.watchlist.push({
                id: item.id,
                type: item.type,
                title: item.title,
                poster_path: item.poster_path,
                vote_average: item.vote_average,
                addedAt: new Date().toISOString()
            });
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Remove item from watchlist
    removeItem(id, type) {
        const initialLength = this.watchlist.length;
        this.watchlist = this.watchlist.filter(item =>
            !(item.id === id && item.type === type)
        );

        if (this.watchlist.length < initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Check if item is in watchlist
    isInWatchlist(id, type) {
        return this.watchlist.some(item =>
            item.id === id && item.type === type
        );
    }

    // Get all watchlist items
    getAll() {
        return this.watchlist;
    }

    // Get count
    getCount() {
        return this.watchlist.length;
    }

    // Clear watchlist
    clear() {
        this.watchlist = [];
        this.saveToStorage();
    }

    // Render watchlist preview
    renderPreview(container) {
        const items = this.watchlist.slice(0, 6); // Show first 6 items

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-watchlist">
                    <i class="fas fa-bookmark"></i>
                    <p>Your watchlist is empty</p>
                    <p class="text-small">Add movies and shows to watch later</p>
                </div>
            `;
            return;
        }

        // This will be replaced with actual rendering logic
        container.innerHTML = `
            <div class="watchlist-preview-grid">
                ${items.map(item => `
                    <div class="watchlist-item" data-id="${item.id}" data-type="${item.type}">
                        <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" 
                             alt="${item.title}"
                             class="watchlist-poster">
                        <div class="watchlist-item-info">
                            <h4>${item.title}</h4>
                            <button class="btn-remove" data-id="${item.id}" data-type="${item.type}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Create singleton instance
const watchlist = new Watchlist();

// Export for use in other modules
export default watchlist;