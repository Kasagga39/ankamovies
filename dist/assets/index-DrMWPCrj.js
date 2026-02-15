(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();const C="modulepreload",N=function(i){return"/"+i},S={},f=function(e,t,r){let n=Promise.resolve();if(t&&t.length>0){let m=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};var a=m;document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");n=m(t.map(d=>{if(d=N(d),d in S)return;S[d]=!0;const u=d.endsWith(".css"),v=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${v}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":C,u||(h.as="script"),h.crossOrigin="",h.href=d,l&&h.setAttribute("nonce",l),document.head.appendChild(h),u)return new Promise((p,M)=>{h.addEventListener("load",p),h.addEventListener("error",()=>M(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(c){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=c,window.dispatchEvent(l),!l.defaultPrevented)throw c}return n.then(c=>{for(const l of c||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})},I={TMDB_API_KEY:"e11c4d81202033837b62fdc66f146610",TMDB_BASE_URL:"https://api.themoviedb.org/3",IMAGE_BASE_URL:"https://image.tmdb.org/t/p"};let g={currentPage:1,totalPages:1,currentFilters:{genre:"",year:"",type:"movie",sortBy:"popularity.desc"},searchQuery:"",isLoading:!1};const o={searchInput:document.getElementById("search-input"),searchBtn:document.getElementById("search-btn"),moviesGrid:document.getElementById("movies-grid"),genreFilter:document.getElementById("genre-filter"),yearFilter:document.getElementById("year-filter"),typeFilter:document.getElementById("type-filter"),sortBy:document.getElementById("sort-by"),trendingCarousel:document.getElementById("trending-carousel"),watchlistSection:document.getElementById("watchlist-section"),watchlistGrid:document.getElementById("watchlist-grid")};async function U(){console.log("Initializing ANKA App..."),await H(),await x(),await K(),z(),V(),console.log("App initialized successfully!")}function V(){W(),o.searchBtn&&o.searchBtn.addEventListener("click",k),o.searchInput&&o.searchInput.addEventListener("keypress",n=>{n.key==="Enter"&&k()});const i=document.getElementById("mobile-search-btn"),e=document.getElementById("mobile-search-input");i&&i.addEventListener("click",F),e&&e.addEventListener("keypress",n=>{n.key==="Enter"&&F()}),o.genreFilter&&o.genreFilter.addEventListener("change",E),o.yearFilter&&o.yearFilter.addEventListener("change",E),o.typeFilter&&o.typeFilter.addEventListener("change",E),o.sortBy&&o.sortBy.addEventListener("change",E);const t=document.getElementById("watchlist-link");t&&t.addEventListener("click",n=>{n.preventDefault(),D()});const r=document.getElementById("mobile-watchlist-link");r&&r.addEventListener("click",n=>{n.preventDefault(),b(),D()})}function W(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");i&&i.addEventListener("click",()=>{j()}),e&&document.addEventListener("click",t=>{i&&!i.contains(t.target)&&!e.contains(t.target)&&b()})}function j(){document.getElementById("mobile-menu-btn"),document.getElementById("mobile-menu").classList.contains("open")?b():q()}function q(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");e&&i&&(e.classList.add("open"),i.classList.add("active"))}function b(){const i=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");e&&i&&(e.classList.remove("open"),i.classList.remove("active"))}async function F(){const i=document.getElementById("mobile-search-input").value.trim();i&&(g.searchQuery=i,b(),await O(i))}async function k(){const i=o.searchInput.value.trim();i&&(g.searchQuery=i,await O(i))}async function E(){g.currentFilters={genre:o.genreFilter.value,year:o.yearFilter.value,type:o.typeFilter.value,sortBy:o.sortBy.value},g.currentPage=1,await Y()}async function H(){try{const i=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>_);return{default:r}},void 0)).default,e=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>w);return{default:r}},void 0)).default,t=await i.getTrending("all","week");o.trendingCarousel&&t&&e.renderCarousel(t,o.trendingCarousel)}catch(i){console.error("Error loading trending movies:",i)}}async function x(){try{const i=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>_);return{default:r}},void 0)).default,e=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>w);return{default:r}},void 0)).default,t=await i.getPopular("movie",1);o.moviesGrid&&t&&e.renderMediaGrid(t.results,"movie",o.moviesGrid)}catch(i){console.error("Error loading popular movies:",i),$(o.moviesGrid,"Failed to load movies")}}async function Y(){try{if(!o.moviesGrid)return;R(o.moviesGrid);const i=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>_);return{default:r}},void 0)).default,e=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>w);return{default:r}},void 0)).default,t=await i.getFiltered(g.currentFilters);t&&e.renderMediaGrid(t.results,g.currentFilters.type,o.moviesGrid)}catch(i){console.error("Error loading filtered movies:",i),$(o.moviesGrid,"Failed to load movies")}}async function O(i){try{if(!o.moviesGrid)return;R(o.moviesGrid);const e=(await f(async()=>{const{default:a}=await Promise.resolve().then(()=>_);return{default:a}},void 0)).default,t=(await f(async()=>{const{default:a}=await Promise.resolve().then(()=>w);return{default:a}},void 0)).default,n=(await e.search(i)).results.filter(a=>a.media_type==="movie"||a.media_type==="tv");if(n.length===0){o.moviesGrid.innerHTML=`
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            `;return}const s=document.createElement("div");s.className="grid",o.moviesGrid.parentElement.replaceChild(s,o.moviesGrid),n.forEach(a=>{const c=t.renderMediaCard(a,a.media_type);s.innerHTML+=c}),o.moviesGrid=s,Q()}catch(e){console.error("Error searching movies:",e),$(o.moviesGrid,"Failed to search movies")}}async function K(){try{const i=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>_);return{default:r}},void 0)).default,e=(await f(async()=>{const{default:r}=await Promise.resolve().then(()=>w);return{default:r}},void 0)).default,t=await i.getGenres("movie");o.genreFilter&&t&&e.renderGenreFilter(t.genres,o.genreFilter),o.yearFilter&&e.renderYearFilter(o.yearFilter)}catch(i){console.error("Error loading filters:",i)}}function z(){try{f(()=>Promise.resolve().then(()=>G),void 0).then(e=>{e.loadWatchlistPreview()})}catch(i){console.error("Error loading watchlist:",i)}}function D(){try{f(()=>Promise.resolve().then(()=>G),void 0).then(e=>{e.showWatchlist()})}catch(i){console.error("Error showing watchlist:",i)}}function Q(){document.querySelectorAll(".movie-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id,r=e.dataset.type;T(t,r)})})}function R(i){i.innerHTML=`
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `}function $(i,e){i.innerHTML=`
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${e}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                Try Again
            </button>
        </div>
    `}function T(i,e="movie"){window.location.href=`details.html?id=${i}&type=${e}`}document.addEventListener("DOMContentLoaded",U);class J{constructor(){this.apiKey=I.TMDB_API_KEY,this.baseURL=I.TMDB_BASE_URL,this.imageBaseURL=I.IMAGE_BASE_URL}async fetchFromTMDB(e,t={}){try{const r=new URL(`${this.baseURL}${e}`);r.searchParams.append("api_key",this.apiKey),r.searchParams.append("language","en-US"),Object.entries(t).forEach(([s,a])=>{a&&r.searchParams.append(s,a)});const n=await fetch(r);if(!n.ok)throw new Error(`TMDB API Error: ${n.status}`);return await n.json()}catch(r){throw console.error("Error fetching from TMDB:",r),r}}async getTrending(e="all",t="week"){const r=`/trending/${e}/${t}`;return await this.fetchFromTMDB(r)}async getPopular(e="movie",t=1){const r=`/${e}/popular`;return await this.fetchFromTMDB(r,{page:t})}async search(e,t=1,r=!1){return await this.fetchFromTMDB("/search/multi",{query:e,page:t,include_adult:r})}async getDetails(e,t="movie"){const r=`/${t}/${e}`;return await this.fetchFromTMDB(r,{append_to_response:"credits,videos,recommendations"})}async getFiltered(e){const{type:t,genre:r,year:n,sortBy:s,page:a=1}=e,c=`/discover/${t}`,l={sort_by:s,page:a,with_genres:r,primary_release_year:t==="movie"?n:void 0,first_air_date_year:t==="tv"?n:void 0,"vote_count.gte":100};return await this.fetchFromTMDB(c,l)}async getGenres(e="movie"){const t=`/genre/${e}/list`;return await this.fetchFromTMDB(t)}getImageURL(e,t="w500"){return e?`${this.imageBaseURL}/${t}${e}`:"https://via.placeholder.com/500x750?text=No+Image"}getBackdropURL(e,t="w1280"){return e?`${this.imageBaseURL}/${t}${e}`:"https://via.placeholder.com/1280x720?text=No+Backdrop"}}const B=new J,_=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"}));class X{renderMediaCard(e,t="movie"){const{id:r,title:n,name:s,poster_path:a,vote_average:c,release_date:l,first_air_date:m,overview:d}=e,u=n||s,v=l||m,h=v?new Date(v).getFullYear():"N/A",p=c?c.toFixed(1):"N/A",M=B.getImageURL(a);return`
            <div class="movie-card" data-id="${r}" data-type="${t}">
                <img src="${M}" 
                     alt="${u}" 
                     class="movie-poster"
                     loading="lazy">
                <div class="movie-info">
                    <h3 class="movie-title" title="${u}">${u}</h3>
                    <div class="movie-meta">
                        <span class="movie-year">${h} • ${t==="tv"?"TV":"Movie"}</span>
                        <span class="movie-rating">
                            <i class="fas fa-star"></i>
                            ${p}
                        </span>
                    </div>
                    ${d?`<p class="movie-overview">${d.substring(0,100)}...</p>`:""}
                </div>
            </div>
        `}renderCarouselSlide(e,t){const{id:r,title:n,name:s,backdrop_path:a,overview:c,vote_average:l,media_type:m}=e,d=n||s,u=B.getBackdropURL(a),v=l?l.toFixed(1):"N/A",h=m==="tv"?"TV Show":"Movie",p=m||"movie";return`
            <div class="carousel-slide" data-index="${t}" data-id="${r}" data-type="${p}">
                <img src="${u}" alt="${d} Backdrop" loading="lazy">
                <div class="carousel-content">
                    <h2 class="carousel-title">${d}</h2>
                    <div class="carousel-rating">
                        <i class="fas fa-star"></i>
                        <span>${v}</span>
                        <span class="dot">•</span>
                        <span>${h}</span>
                    </div>
                    <p class="carousel-overview">${c.substring(0,150)}...</p>
                    <button class="btn btn-primary view-details" 
                            data-id="${r}" 
                            data-type="${p}">
                        View Details
                    </button>
                </div>
            </div>
        `}renderMediaGrid(e,t="movie",r){if(!e||e.length===0){r.innerHTML=`
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <h3>No results found</h3>
                    <p>Try different filters or search terms</p>
                </div>
            `;return}const n=e.map(s=>this.renderMediaCard(s,t)).join("");r.innerHTML=n,r.querySelectorAll(".movie-card").forEach(s=>{s.addEventListener("click",a=>{const c=s.dataset.id,l=s.dataset.type;T(c,l)})})}renderCarousel(e,t){const r=e.results.slice(0,10).map((s,a)=>this.renderCarouselSlide(s,a)).join("");t.innerHTML=r;const n=document.querySelector(".carousel-dots");if(n){const s=e.results.slice(0,10).map((a,c)=>`<button class="carousel-dot ${c===0?"active":""}" 
                         data-index="${c}"></button>`).join("");n.innerHTML=s}t.querySelectorAll(".view-details").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation();const c=s.dataset.id,l=s.dataset.type;T(c,l)})}),this.setupCarouselControls()}setupCarouselControls(){const e=document.querySelector(".carousel"),t=document.querySelector(".carousel-btn.prev"),r=document.querySelector(".carousel-btn.next"),n=document.querySelectorAll(".carousel-dot");if(!e||!t||!r)return;let s=0;const a=e.children.length;t.addEventListener("click",()=>{s=(s-1+a)%a,l(s),m()}),r.addEventListener("click",()=>{s=(s+1)%a,l(s),m()}),n.forEach((d,u)=>{d.addEventListener("click",()=>{s=u,l(u),m()})});let c=setInterval(()=>{s=(s+1)%a,l(s),m()},5e3);e.addEventListener("mouseenter",()=>{clearInterval(c)}),e.addEventListener("mouseleave",()=>{c=setInterval(()=>{s=(s+1)%a,l(s),m()},5e3)});function l(d){const u=e.children[d];e.scrollTo({left:u.offsetLeft,behavior:"smooth"})}function m(){n.forEach((d,u)=>{d.classList.toggle("active",u===s)})}}renderGenreFilter(e,t){const r=e.map(n=>`<option value="${n.id}">${n.name}</option>`).join("");t.innerHTML=`
            <option value="">All Genres</option>
            ${r}
        `}renderYearFilter(e){const t=new Date().getFullYear();let r='<option value="">All Years</option>';for(let n=t;n>=1900;n--)r+=`<option value="${n}">${n}</option>`;e.innerHTML=r}}const P=new X,w=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));class Z{constructor(){this.storageKey="ANKA_watchlist",this.watchlist=this.loadFromStorage()}loadFromStorage(){try{const e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):[]}catch(e){return console.error("Error loading watchlist:",e),[]}}saveToStorage(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.watchlist))}catch(e){console.error("Error saving watchlist:",e)}}addItem(e){return this.isInWatchlist(e.id,e.type)?!1:(this.watchlist.push({id:e.id,type:e.type,title:e.title,poster_path:e.poster_path,vote_average:e.vote_average,addedAt:new Date().toISOString()}),this.saveToStorage(),!0)}removeItem(e,t){const r=this.watchlist.length;return this.watchlist=this.watchlist.filter(n=>!(n.id===e&&n.type===t)),this.watchlist.length<r?(this.saveToStorage(),!0):!1}isInWatchlist(e,t){return this.watchlist.some(r=>r.id===e&&r.type===t)}getAll(){return this.watchlist}getCount(){return this.watchlist.length}clear(){this.watchlist=[],this.saveToStorage()}renderPreview(e){const t=this.watchlist.slice(0,6);if(t.length===0){e.innerHTML=`
                <div class="empty-watchlist">
                    <i class="fas fa-bookmark"></i>
                    <p>Your watchlist is empty</p>
                    <p class="text-small">Add movies and shows to watch later</p>
                </div>
            `;return}e.innerHTML=`
            <div class="watchlist-preview-grid">
                ${t.map(r=>`
                    <div class="watchlist-item" data-id="${r.id}" data-type="${r.type}">
                        <img src="https://image.tmdb.org/t/p/w200${r.poster_path}" 
                             alt="${r.title}"
                             class="watchlist-poster">
                        <div class="watchlist-item-info">
                            <h4>${r.title}</h4>
                            <button class="btn-remove" data-id="${r.id}" data-type="${r.type}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `}}const y=new Z;function A(){const i=o.watchlistGrid;if(!i)return;const e=y.getAll();if(e.length===0){i.innerHTML=`
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
    `,document.body.appendChild(e);const t=e.querySelector("#full-watchlist-grid");P.renderMediaGrid(i,"movie",t),e.querySelector(".close-watchlist").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",r=>{r.target===e&&e.remove()})}function te(i){y.addItem(i)?(L("Added to watchlist!","success"),A()):L("Already in watchlist","info")}function re(i,e){y.removeItem(i,e)&&(L("Removed from watchlist","info"),A())}function ie(i,e){return y.isInWatchlist(i,e)}function L(i,e="info"){const t=document.createElement("div");t.className=`notification notification-${e}`,t.textContent=i,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},100),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),300)},3e3)}const G=Object.freeze(Object.defineProperty({__proto__:null,addToWatchlistFromDetails:te,isInWatchlist:ie,loadWatchlistPreview:A,removeFromWatchlist:re,showNotification:L,showWatchlist:ee,watchlist:y},Symbol.toStringTag,{value:"Module"}));
