import { CONFIG, showLoading, showError } from './app.js';

class TMDBAPI {
    constructor() {
        this.apiKey = CONFIG.TMDB_API_KEY;
        this.baseURL = CONFIG.TMDB_BASE_URL;
        this.imageBaseURL = CONFIG.IMAGE_BASE_URL;
    }

    // Helper method to make API calls
    async fetchFromTMDB(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            url.searchParams.append('api_key', this.apiKey);
            url.searchParams.append('language', 'en-US');

            // Add additional parameters
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`TMDB API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching from TMDB:', error);
            throw error;
        }
    }

    // Get trending movies/TV for carousel
    async getTrending(mediaType = 'all', timeWindow = 'week') {
        const endpoint = `/trending/${mediaType}/${timeWindow}`;
        return await this.fetchFromTMDB(endpoint);
    }

    // Get popular movies/TV
    async getPopular(mediaType = 'movie', page = 1) {
        const endpoint = `/${mediaType}/popular`;
        return await this.fetchFromTMDB(endpoint, { page });
    }

    // Search movies/TV/people
    async search(query, page = 1, includeAdult = false) {
        const endpoint = '/search/multi';
        return await this.fetchFromTMDB(endpoint, {
            query,
            page,
            include_adult: includeAdult
        });
    }

    // Get movie/TV details by ID
    async getDetails(id, mediaType = 'movie') {
        const endpoint = `/${mediaType}/${id}`;
        return await this.fetchFromTMDB(endpoint, {
            append_to_response: 'credits,videos,recommendations'
        });
    }

    // Get filtered movies/TV
    async getFiltered(filters) {
        const { type, genre, year, sortBy, page = 1 } = filters;
        const endpoint = `/discover/${type}`;

        const params = {
            sort_by: sortBy,
            page,
            with_genres: genre,
            primary_release_year: type === 'movie' ? year : undefined,
            first_air_date_year: type === 'tv' ? year : undefined,
            'vote_count.gte': 100 // Ensure some minimum votes for quality
        };

        return await this.fetchFromTMDB(endpoint, params);
    }

    // Get all genres
    async getGenres(mediaType = 'movie') {
        const endpoint = `/genre/${mediaType}/list`;
        return await this.fetchFromTMDB(endpoint);
    }

    // Get image URL
    getImageURL(path, size = 'w500') {
        if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
        return `${this.imageBaseURL}/${size}${path}`;
    }

    // Get backdrop URL
    getBackdropURL(path, size = 'w1280') {
        if (!path) return 'https://via.placeholder.com/1280x720?text=No+Backdrop';
        return `${this.imageBaseURL}/${size}${path}`;
    }
}

// Create singleton instance
const tmdb = new TMDBAPI();

// Export for use in other modules
export default tmdb;