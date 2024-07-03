document.getElementById('searchForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
    if (!query) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySearchResults(data.items);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
});

function displaySearchResults(videos: any[]) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = ''; 
    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.dataset.videoId = video.id.videoId;

        const favoriteStar = document.createElement('span');
        favoriteStar.classList.add('favorite-star', 'far', 'fa-star');
        favoriteStar.onclick = () => toggleFavorite(video.id.videoId, favoriteStar);
        videoItem.appendChild(favoriteStar);

        const videoThumbnail = document.createElement('img');
        videoThumbnail.src = video.snippet.thumbnails.default.url;
        videoThumbnail.alt = video.snippet.title;
        videoItem.appendChild(videoThumbnail);

        resultsContainer.appendChild(videoItem);
    });
}

function toggleFavorite(videoId: string, starElement: HTMLElement) {
    let favorites = getFavorites();
    const index = favorites.indexOf(videoId);
    if (index !== -1) {
        favorites.splice(index, 1); // Remove from favorites if already favorited
        starElement.classList.remove('fas', 'fa-star');
        starElement.classList.add('far', 'fa-star');
    } else {
        favorites.push(videoId); // Add to favorites if not favorited
        starElement.classList.remove('far', 'fa-star');
        starElement.classList.add('fas', 'fa-star');
    }
    saveFavorites(favorites);
    updateFavoriteCounter();
}

function getFavorites(): string[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites: string[]) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteCounter() {
    const favoriteCounter = document.getElementById('favoriteCounter');
    const favorites = getFavorites();
    if (favoriteCounter) {
        favoriteCounter.textContent = `Favorites: ${favorites.length}`;
    }
}

function updateStarIcons() {
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach((item: Element) => {
        const videoId = item.getAttribute('data-video-id');
        if (!videoId) return;

        const isFavorite = getFavorites().includes(videoId);
        const starIcon = item.querySelector('.favorite-star');
        if (starIcon instanceof HTMLElement) {
            if (isFavorite) {
                starIcon.classList.add('fas', 'fa-star');
                starIcon.classList.remove('far', 'fa-star');
            } else {
                starIcon.classList.remove('fas', 'fa-star');
                starIcon.classList.add('far', 'fa-star');
            }
        }
    });
}

function fetchFavoritesAndDisplay() {
    const favorites = getFavorites();
    displayFavoriteVideos(favorites);
}

function displayFavoriteVideos(favorites: string[]) {
    const favoriteList = document.getElementById('favoriteList');
    if (!favoriteList) return;

    favoriteList.innerHTML = '';
    favorites.forEach(videoId => {
        const favoriteItem = document.createElement('div');
        favoriteItem.textContent = `Favorite Video ID: ${videoId}`;
        favoriteList.appendChild(favoriteItem);
    });
}

if (document.getElementById('favoriteList')) {
    fetchFavoritesAndDisplay();
}
updateFavoriteCounter();
updateStarIcons();
