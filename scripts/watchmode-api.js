import { CONFIG } from './app.js';

class WatchmodeAPI {
    constructor() {
        this.apiKey = CONFIG.WATCHMODE_API_KEY;
        this.baseURL = 'https://api.watchmode.com/v1';
    }

    // Helper method to make API calls
    async fetchFromWatchmode(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            url.searchParams.append('apiKey', this.apiKey);

            // Add additional parameters
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });

            const response = await fetch(url);

            if (!response.ok) {
                // Watchmode API might return 404 for some content, which is okay
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Watchmode API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Error fetching from Watchmode:', error);
            // Return null gracefully if Watchmode API fails
            return null;
        }
    }

    // Get streaming availability by TMDB ID
    async getStreamingAvailability(tmdbId, mediaType = 'movie') {
        const endpoint = '/title/details/';
        const params = {
            source_id: tmdbId,
            source_type: mediaType === 'tv' ? 'tv_series' : 'tmdb_movie'
        };

        return await this.fetchFromWatchmode(endpoint, params);
    }

    // Get streaming sources/providers
    async getStreamingSources(watchmodeId) {
        const endpoint = `/title/${watchmodeId}/sources/`;
        return await this.fetchFromWatchmode(endpoint);
    }

    // Search for title
    async searchTitle(query) {
        const endpoint = '/search/title/';
        const params = { query };
        return await this.fetchFromWatchmode(endpoint, params);
    }

    // Format streaming data for display
    formatStreamingData(data) {
        if (!data || !data.sources) {
            return {
                hasStreaming: false,
                services: [],
                message: 'Streaming data not available'
            };
        }

        // Group by type (subscription, rent, buy)
        const grouped = {};
        data.sources.forEach(source => {
            if (!grouped[source.type]) {
                grouped[source.type] = [];
            }
            grouped[source.type].push(source);
        });

        return {
            hasStreaming: true,
            services: grouped,
            message: 'Check where to watch'
        };
    }
}

// Create singleton instance
const watchmode = new WatchmodeAPI();

// Export for use in other modules
export default watchmode;
