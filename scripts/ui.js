import tmdb from './tmdb-api.js';
import { navigateToDetails, showLoading, showError, DOM } from './app.js';

class UI {
    // Render movie/TV card
    renderMediaCard(media, mediaType = 'movie') {
        const {
            id,
            title,
            name,
            poster_path,
            vote_average,
            release_date,
            first_air_date,
            overview
        } = media;

        const titleText = title || name;
        const releaseDate = release_date || first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
        const posterURL = tmdb.getImageURL(poster_path);
        const type = mediaType === 'tv' ? 'TV' : 'Movie';

        return `
            <div class="movie-card" data-id="${id}" data-type="${mediaType}">
                <img src="${posterURL}" 
                     alt="${titleText}" 
                     class="movie-poster"
                     loading="lazy">
                <div class="movie-info">
                    <h3 class="movie-title" title="${titleText}">${titleText}</h3>
                    <div class="movie-meta">
                        <span class="movie-year">${year} • ${type}</span>
                        <span class="movie-rating">
                            <i class="fas fa-star"></i>
                            ${rating}
                        </span>
                    </div>
                    ${overview ? `<p class="movie-overview">${overview.substring(0, 100)}...</p>` : ''}
                </div>
            </div>
        `;
    }

    // Render carousel slide
    renderCarouselSlide(media, index) {
        const {
            id,
            title,
            name,
            backdrop_path,
            overview,
            vote_average,
            media_type
        } = media;

        const titleText = title || name;
        const backdropURL = tmdb.getBackdropURL(backdrop_path);
        const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
        const type = media_type === 'tv' ? 'TV Show' : 'Movie';
        const mediaType = media_type || 'movie';

        return `
            <div class="carousel-slide" data-index="${index}" data-id="${id}" data-type="${mediaType}">
                <img src="${backdropURL}" alt="${titleText} Backdrop" loading="lazy">
                <div class="carousel-content">
                    <h2 class="carousel-title">${titleText}</h2>
                    <div class="carousel-rating">
                        <i class="fas fa-star"></i>
                        <span>${rating}</span>
                        <span class="dot">•</span>
                        <span>${type}</span>
                    </div>
                    <p class="carousel-overview">${overview.substring(0, 150)}...</p>
                    <button class="btn btn-primary view-details" 
                            data-id="${id}" 
                            data-type="${mediaType}">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    // Render grid of movies/TV
    renderMediaGrid(mediaArray, mediaType = 'movie', container) {
        if (!mediaArray || mediaArray.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <h3>No results found</h3>
                    <p>Try different filters or search terms</p>
                </div>
            `;
            return;
        }

        const gridHTML = mediaArray.map(media =>
            this.renderMediaCard(media, mediaType)
        ).join('');

        container.innerHTML = gridHTML;

        // Add click events to cards
        container.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = card.dataset.id;
                const type = card.dataset.type;
                navigateToDetails(id, type);
            });
        });
    }

    // Render carousel
    renderCarousel(trendingData, container) {
        const slides = trendingData.results
            .slice(0, 10) // Only show top 10
            .map((media, index) => this.renderCarouselSlide(media, index))
            .join('');

        container.innerHTML = slides;

        // Add dots
        const dotsContainer = document.querySelector('.carousel-dots');
        if (dotsContainer) {
            const dots = trendingData.results.slice(0, 10).map((_, index) =>
                `<button class="carousel-dot ${index === 0 ? 'active' : ''}" 
                         data-index="${index}"></button>`
            ).join('');
            dotsContainer.innerHTML = dots;
        }

        // Add click events
        container.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const type = btn.dataset.type;
                navigateToDetails(id, type);
            });
        });

        // Add carousel controls
        this.setupCarouselControls();
    }

    // Setup carousel controls
    setupCarouselControls() {
        const carousel = document.querySelector('.carousel');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dots = document.querySelectorAll('.carousel-dot');

        if (!carousel || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const slideCount = carousel.children.length;

        // Previous button
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            scrollToSlide(currentIndex);
            updateDots();
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideCount;
            scrollToSlide(currentIndex);
            updateDots();
        });

        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                scrollToSlide(index);
                updateDots();
            });
        });

        // Auto-rotate (every 5 seconds)
        let autoRotate = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            scrollToSlide(currentIndex);
            updateDots();
        }, 5000);

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });

        carousel.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                scrollToSlide(currentIndex);
                updateDots();
            }, 5000);
        });

        function scrollToSlide(index) {
            const slide = carousel.children[index];
            carousel.scrollTo({
                left: slide.offsetLeft,
                behavior: 'smooth'
            });
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    // Render genre filter options
    renderGenreFilter(genres, container) {
        const options = genres.map(genre =>
            `<option value="${genre.id}">${genre.name}</option>`
        ).join('');

        container.innerHTML = `
            <option value="">All Genres</option>
            ${options}
        `;
    }

    // Render year filter options
    renderYearFilter(container) {
        const currentYear = new Date().getFullYear();
        let options = '<option value="">All Years</option>';

        for (let year = currentYear; year >= 1900; year--) {
            options += `<option value="${year}">${year}</option>`;
        }

        container.innerHTML = options;
    }
}

// Create singleton instance
const ui = new UI();

// Export for use in other modules
export default ui;