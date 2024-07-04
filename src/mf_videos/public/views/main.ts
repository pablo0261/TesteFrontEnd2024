document.getElementById('searchForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
    if (!query) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySearchResults(data.items.slice(0, 12)); // Limit to 12 videos
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

        const favoriteStar = document.createElement('i');
        favoriteStar.classList.add('favorite-star', 'far', 'fa-star');
        favoriteStar.onclick = () => toggleFavorite(video.id.videoId, favoriteStar);
        videoItem.appendChild(favoriteStar);

        const videoThumbnail = document.createElement('img');
        videoThumbnail.src = video.snippet.thumbnails.default.url;
        videoThumbnail.alt = video.snippet.title;
        videoThumbnail.onclick = () => playVideo(video.id.videoId, videoItem);
        videoItem.appendChild(videoThumbnail);

        resultsContainer.appendChild(videoItem);
    });
}

function playVideo(videoId: string, container: HTMLElement) {
    const videoPlayer = document.createElement('div');
    videoPlayer.classList.add('video-player');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // Unicode character for X
    closeButton.classList.add('close-button');
    closeButton.onclick = () => document.body.removeChild(videoPlayer);

    videoPlayer.appendChild(closeButton);
    videoPlayer.appendChild(iframe);
    document.body.appendChild(videoPlayer); // Append to body to overlay on top of all content
}

function toggleFavorite(videoId: string, starElement: HTMLElement) {
    let favorites = getFavorites();
    const index = favorites.indexOf(videoId);
    if (index !== -1) {
        favorites.splice(index, 1); 
        starElement.classList.remove('fas');
        starElement.classList.add('far');
    } else {
        favorites.push(videoId); 
        starElement.classList.remove('far');
        starElement.classList.add('fas');
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
                starIcon.classList.add('fas');
                starIcon.classList.remove('far');
            } else {
                starIcon.classList.remove('fas');
                starIcon.classList.add('far');
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
