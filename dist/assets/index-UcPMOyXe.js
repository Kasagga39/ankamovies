(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const G="modulepreload",N=function(i){return"/"+i},S={},v=function(e,r,t){let n=Promise.resolve();if(r&&r.length>0){let m=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};var o=m;document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),d=c?.nonce||c?.getAttribute("nonce");n=m(r.map(l=>{if(l=N(l),l in S)return;S[l]=!0;const u=l.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${f}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":G,u||(h.as="script"),h.crossOrigin="",h.href=l,d&&h.setAttribute("nonce",d),document.head.appendChild(h),u)return new Promise((p,M)=>{h.addEventListener("load",p),h.addEventListener("error",()=>M(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(c){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=c,window.dispatchEvent(d),!d.defaultPrevented)throw c}return n.then(c=>{for(const d of c||[])d.status==="rejected"&&s(d.reason);return e().catch(s)})},I={TMDB_API_KEY:"e11c4d81202033837b62fdc66f146610",TMDB_BASE_URL:"https://api.themoviedb.org/3",IMAGE_BASE_URL:"https://image.tmdb.org/t/p"};let g={currentPage:1,totalPages:1,currentFilters:{genre:"",year:"",type:"movie",sortBy:"popularity.desc"},searchQuery:"",isLoading:!1};const a={searchInput:document.getElementById("search-input"),searchBtn:document.getElementById("search-btn"),moviesGrid:document.getElementById("movies-grid"),genreFilter:document.getElementById("genre-filter"),yearFilter:document.getElementById("year-filter"),typeFilter:document.getElementById("type-filter"),sortBy:document.getElementById("sort-by"),trendingCarousel:document.getElementById("trending-carousel"),watchlistSection:document.getElementById("watchlist-section"),watchlistGrid:document.getElementById("watchlist-grid")};async function U(){console.log("Initializing ANKA App..."),await x(),await H(),await K(),z(),V(),console.log("App initialized successfully!")}function V(){W(),a.searchBtn&&a.searchBtn.addEventListener("click",F),a.searchInput&&a.searchInput.addEventListener("keypress",n=>{n.key==="Enter"&&F()});const i=document.getElementById("mobile-search-btn"),e=document.getElementById("mobile-search-input");i&&i.addEventListener("click",D),e&&e.addEventListener("keypress",n=>{n.key==="Enter"&&D()}),a.genreFilter&&a.genreFilter.addEventListener("change",E),a.yearFilter&&a.yearFilter.addEventListener("change",E),a.typeFilter&&a.typeFilter.addEventListener("change",E),a.sortBy&&a.sortBy.addEventListener("change",E);const r=document.getElementById("watchlist-link");r&&r.addEventListener("click",n=>{n.preventDefault(),k()});const t=document.getElementById("mobile-watchlist-link");t&&t.addEventListener("click",n=>{n.preventDefault(),b(),k()})}function W(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");i&&i.addEventListener("click",()=>{j()}),e&&document.addEventListener("click",r=>{i&&!i.contains(r.target)&&!e.contains(r.target)&&b()})}function j(){document.getElementById("mobile-menu-btn"),document.getElementById("mobile-menu").classList.contains("open")?b():q()}function q(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");e&&i&&(e.classList.add("open"),i.classList.add("active"))}function b(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");e&&i&&(e.classList.remove("open"),i.classList.remove("active"))}async function D(){const i=document.getElementById("mobile-search-input").value.trim();i&&(g.searchQuery=i,b(),await O(i))}async function F(){const i=a.searchInput.value.trim();i&&(g.searchQuery=i,await O(i))}async function E(){g.currentFilters={genre:a.genreFilter.value,year:a.yearFilter.value,type:a.typeFilter.value,sortBy:a.sortBy.value},g.currentPage=1,await Y()}async function x(){try{const i=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>_);return{default:t}},void 0)).default,e=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>w);return{default:t}},void 0)).default,r=await i.getTrending("all","week");a.trendingCarousel&&r&&e.renderCarousel(r,a.trendingCarousel)}catch(i){console.error("Error loading trending movies:",i)}}async function H(){try{const i=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>_);return{default:t}},void 0)).default,e=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>w);return{default:t}},void 0)).default,r=await i.getPopular("movie",1);a.moviesGrid&&r&&e.renderMediaGrid(r.results,"movie",a.moviesGrid)}catch(i){console.error("Error loading popular movies:",i),T(a.moviesGrid,"Failed to load movies")}}async function Y(){try{if(!a.moviesGrid)return;R(a.moviesGrid);const i=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>_);return{default:t}},void 0)).default,e=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>w);return{default:t}},void 0)).default,r=await i.getFiltered(g.currentFilters);r&&e.renderMediaGrid(r.results,g.currentFilters.type,a.moviesGrid)}catch(i){console.error("Error loading filtered movies:",i),T(a.moviesGrid,"Failed to load movies")}}async function O(i){try{if(!a.moviesGrid)return;R(a.moviesGrid);const e=(await v(async()=>{const{default:o}=await Promise.resolve().then(()=>_);return{default:o}},void 0)).default,r=(await v(async()=>{const{default:o}=await Promise.resolve().then(()=>w);return{default:o}},void 0)).default,n=(await e.search(i)).results.filter(o=>o.media_type==="movie"||o.media_type==="tv");if(n.length===0){a.moviesGrid.innerHTML=`
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            `;return}const s=document.createElement("div");s.className="grid",a.moviesGrid.parentElement.replaceChild(s,a.moviesGrid),n.forEach(o=>{const c=r.renderMediaCard(o,o.media_type);s.innerHTML+=c}),a.moviesGrid=s,Q()}catch(e){console.error("Error searching movies:",e),T(a.moviesGrid,"Failed to search movies")}}async function K(){try{const i=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>_);return{default:t}},void 0)).default,e=(await v(async()=>{const{default:t}=await Promise.resolve().then(()=>w);return{default:t}},void 0)).default,r=await i.getGenres("movie");a.genreFilter&&r&&e.renderGenreFilter(r.genres,a.genreFilter),a.yearFilter&&e.renderYearFilter(a.yearFilter)}catch(i){console.error("Error loading filters:",i)}}function z(){try{v(()=>Promise.resolve().then(()=>C),void 0).then(e=>{e.loadWatchlistPreview()})}catch(i){console.error("Error loading watchlist:",i)}}function k(){try{v(()=>Promise.resolve().then(()=>C),void 0).then(e=>{e.showWatchlist()})}catch(i){console.error("Error showing watchlist:",i)}}function Q(){document.querySelectorAll(".movie-card").forEach(e=>{e.addEventListener("click",()=>{const r=e.dataset.id,t=e.dataset.type;B(r,t)})})}function R(i){i.innerHTML=`
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `}function T(i,e){i.innerHTML=`
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${e}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                Try Again
            </button>
        </div>
    `}function B(i,e="movie"){window.location.href=`details.html?id=${i}&type=${e}`}document.addEventListener("DOMContentLoaded",U);class J{constructor(){this.apiKey=I.TMDB_API_KEY,this.baseURL=I.TMDB_BASE_URL,this.imageBaseURL=I.IMAGE_BASE_URL}async fetchFromTMDB(e,r={}){try{const t=new URL(`${this.baseURL}${e}`);t.searchParams.append("api_key",this.apiKey),t.searchParams.append("language","en-US"),Object.entries(r).forEach(([s,o])=>{o&&t.searchParams.append(s,o)});const n=await fetch(t);if(!n.ok)throw new Error(`TMDB API Error: ${n.status}`);return await n.json()}catch(t){throw console.error("Error fetching from TMDB:",t),t}}async getTrending(e="all",r="week"){const t=`/trending/${e}/${r}`;return await this.fetchFromTMDB(t)}async getPopular(e="movie",r=1){const t=`/${e}/popular`;return await this.fetchFromTMDB(t,{page:r})}async search(e,r=1,t=!1){return await this.fetchFromTMDB("/search/multi",{query:e,page:r,include_adult:t})}async getDetails(e,r="movie"){const t=`/${r}/${e}`;return await this.fetchFromTMDB(t,{append_to_response:"credits,videos,recommendations"})}async getFiltered(e){const{type:r,genre:t,year:n,sortBy:s,page:o=1}=e;if(r==="all"){const[c,d]=await Promise.all([this.fetchDiscoverData("movie",t,n,s,o),this.fetchDiscoverData("tv",t,n,s,o)]),m=[...c.results.map(l=>({...l,media_type:"movie"})),...d.results.map(l=>({...l,media_type:"tv"}))];return m.sort((l,u)=>{if(s==="popularity.desc")return u.popularity-l.popularity;if(s==="vote_average.desc")return u.vote_average-l.vote_average;if(s==="release_date.desc"){const f=new Date(l.release_date||l.first_air_date||0);return new Date(u.release_date||u.first_air_date||0)-f}else if(s==="title.asc"){const f=(l.title||l.name||"").toLowerCase(),h=(u.title||u.name||"").toLowerCase();return f.localeCompare(h)}return 0}),{results:m.slice(0,20),total_pages:Math.max(c.total_pages,d.total_pages),page:o}}return await this.fetchDiscoverData(r,t,n,s,o)}async fetchDiscoverData(e,r,t,n,s=1){const o=`/discover/${e}`,c={sort_by:n,page:s,with_genres:r||void 0,primary_release_year:e==="movie"&&t?t:void 0,first_air_date_year:e==="tv"&&t?t:void 0,"vote_count.gte":100};return await this.fetchFromTMDB(o,c)}async getGenres(e="movie"){const r=`/genre/${e}/list`;return await this.fetchFromTMDB(r)}getImageURL(e,r="w500"){return e?`${this.imageBaseURL}/${r}${e}`:"https://via.placeholder.com/500x750?text=No+Image"}getBackdropURL(e,r="w1280"){return e?`${this.imageBaseURL}/${r}${e}`:"https://via.placeholder.com/1280x720?text=No+Backdrop"}}const $=new J,_=Object.freeze(Object.defineProperty({__proto__:null,default:$},Symbol.toStringTag,{value:"Module"}));class X{renderMediaCard(e,r="movie"){const{id:t,title:n,name:s,poster_path:o,vote_average:c,release_date:d,first_air_date:m,overview:l}=e,u=n||s,f=d||m,h=f?new Date(f).getFullYear():"N/A",p=c?c.toFixed(1):"N/A",M=$.getImageURL(o);return`
            <div class="movie-card" data-id="${t}" data-type="${r}">
                <img src="${M}" 
                     alt="${u}" 
                     class="movie-poster"
                     loading="lazy">
                <div class="movie-info">
                    <h3 class="movie-title" title="${u}">${u}</h3>
                    <div class="movie-meta">
                        <span class="movie-year">${h} • ${r==="tv"?"TV":"Movie"}</span>
                        <span class="movie-rating">
                            <i class="fas fa-star"></i>
                            ${p}
                        </span>
                    </div>
                    ${l?`<p class="movie-overview">${l.substring(0,100)}...</p>`:""}
                </div>
            </div>
        `}renderCarouselSlide(e,r){const{id:t,title:n,name:s,backdrop_path:o,overview:c,vote_average:d,media_type:m}=e,l=n||s,u=$.getBackdropURL(o),f=d?d.toFixed(1):"N/A",h=m==="tv"?"TV Show":"Movie",p=m||"movie";return`
            <div class="carousel-slide" data-index="${r}" data-id="${t}" data-type="${p}">
                <img src="${u}" alt="${l} Backdrop" loading="lazy">
                <div class="carousel-content">
                    <h2 class="carousel-title">${l}</h2>
                    <div class="carousel-rating">
                        <i class="fas fa-star"></i>
                        <span>${f}</span>
                        <span class="dot">•</span>
                        <span>${h}</span>
                    </div>
                    <p class="carousel-overview">${c.substring(0,150)}...</p>
                    <button class="btn btn-primary view-details" 
                            data-id="${t}" 
                            data-type="${p}">
                        View Details
                    </button>
                </div>
            </div>
        `}renderMediaGrid(e,r="movie",t){if(!e||e.length===0){t.innerHTML=`
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <h3>No results found</h3>
                    <p>Try different filters or search terms</p>
                </div>
            `;return}const n=e.map(s=>this.renderMediaCard(s,r)).join("");t.innerHTML=n,t.querySelectorAll(".movie-card").forEach(s=>{s.addEventListener("click",o=>{const c=s.dataset.id,d=s.dataset.type;B(c,d)})})}renderCarousel(e,r){const t=e.results.slice(0,10).map((s,o)=>this.renderCarouselSlide(s,o)).join("");r.innerHTML=t;const n=document.querySelector(".carousel-dots");if(n){const s=e.results.slice(0,10).map((o,c)=>`<button class="carousel-dot ${c===0?"active":""}" 
                         data-index="${c}"></button>`).join("");n.innerHTML=s}r.querySelectorAll(".view-details").forEach(s=>{s.addEventListener("click",o=>{o.stopPropagation();const c=s.dataset.id,d=s.dataset.type;B(c,d)})}),this.setupCarouselControls()}setupCarouselControls(){const e=document.querySelector(".carousel"),r=document.querySelector(".carousel-btn.prev"),t=document.querySelector(".carousel-btn.next"),n=document.querySelectorAll(".carousel-dot");if(!e||!r||!t)return;let s=0;const o=e.children.length;r.addEventListener("click",()=>{s=(s-1+o)%o,d(s),m()}),t.addEventListener("click",()=>{s=(s+1)%o,d(s),m()}),n.forEach((l,u)=>{l.addEventListener("click",()=>{s=u,d(u),m()})});let c=setInterval(()=>{s=(s+1)%o,d(s),m()},5e3);e.addEventListener("mouseenter",()=>{clearInterval(c)}),e.addEventListener("mouseleave",()=>{c=setInterval(()=>{s=(s+1)%o,d(s),m()},5e3)});function d(l){const u=e.children[l];e.scrollTo({left:u.offsetLeft,behavior:"smooth"})}function m(){n.forEach((l,u)=>{l.classList.toggle("active",u===s)})}}renderGenreFilter(e,r){const t=e.map(n=>`<option value="${n.id}">${n.name}</option>`).join("");r.innerHTML=`
            <option value="">All Genres</option>
            ${t}
        `}renderYearFilter(e){const r=new Date().getFullYear();let t='<option value="">All Years</option>';for(let n=r;n>=1900;n--)t+=`<option value="${n}">${n}</option>`;e.innerHTML=t}}const P=new X,w=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));class Z{constructor(){this.storageKey="ANKA_watchlist",this.watchlist=this.loadFromStorage()}loadFromStorage(){try{const e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):[]}catch(e){return console.error("Error loading watchlist:",e),[]}}saveToStorage(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.watchlist))}catch(e){console.error("Error saving watchlist:",e)}}addItem(e){return this.isInWatchlist(e.id,e.type)?!1:(this.watchlist.push({id:e.id,type:e.type,title:e.title,poster_path:e.poster_path,vote_average:e.vote_average,addedAt:new Date().toISOString()}),this.saveToStorage(),!0)}removeItem(e,r){const t=this.watchlist.length;return this.watchlist=this.watchlist.filter(n=>!(n.id===e&&n.type===r)),this.watchlist.length<t?(this.saveToStorage(),!0):!1}isInWatchlist(e,r){return this.watchlist.some(t=>t.id===e&&t.type===r)}getAll(){return this.watchlist}getCount(){return this.watchlist.length}clear(){this.watchlist=[],this.saveToStorage()}renderPreview(e){const r=this.watchlist.slice(0,6);if(r.length===0){e.innerHTML=`
                <div class="empty-watchlist">
                    <i class="fas fa-bookmark"></i>
                    <p>Your watchlist is empty</p>
                    <p class="text-small">Add movies and shows to watch later</p>
                </div>
            `;return}e.innerHTML=`
            <div class="watchlist-preview-grid">
                ${r.map(t=>`
                    <div class="watchlist-item" data-id="${t.id}" data-type="${t.type}">
                        <img src="https://image.tmdb.org/t/p/w200${t.poster_path}" 
                             alt="${t.title}"
                             class="watchlist-poster">
                        <div class="watchlist-item-info">
                            <h4>${t.title}</h4>
                            <button class="btn-remove" data-id="${t.id}" data-type="${t.type}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `}}const y=new Z;function A(){const i=a.watchlistGrid;if(!i)return;const e=y.getAll();if(e.length===0){i.innerHTML=`
            <div class="empty-watchlist">
                <i class="fas fa-bookmark"></i>
                <h3>Your watchlist is empty</h3>
                <p>Start adding movies and shows to keep track of what you want to watch!</p>
            </div>
        `;return}P.renderMediaGrid(e,"movie",i)}function ee(){const i=y.getAll();if(i.length===0){alert("Your watchlist is empty!");return}const e=document.createElement("div");e.className="watchlist-modal",e.innerHTML=`
        <div class="watchlist-content">
            <div class="watchlist-header">
                <h1>My Watchlist (${i.length} items)</h1>
                <button class="close-watchlist">&times;</button>
            </div>
            <div class="grid" id="full-watchlist-grid"></div>
        </div>
    `,document.body.appendChild(e);const r=e.querySelector("#full-watchlist-grid");P.renderMediaGrid(i,"movie",r),e.querySelector(".close-watchlist").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",t=>{t.target===e&&e.remove()})}function te(i){y.addItem(i)?(L("Added to watchlist!","success"),A()):L("Already in watchlist","info")}function re(i,e){y.removeItem(i,e)&&(L("Removed from watchlist","info"),A())}function ie(i,e){return y.isInWatchlist(i,e)}function L(i,e="info"){const r=document.createElement("div");r.className=`notification notification-${e}`,r.textContent=i,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},100),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>r.remove(),300)},3e3)}const C=Object.freeze(Object.defineProperty({__proto__:null,addToWatchlistFromDetails:te,isInWatchlist:ie,loadWatchlistPreview:A,removeFromWatchlist:re,showNotification:L,showWatchlist:ee,watchlist:y},Symbol.toStringTag,{value:"Module"}));
