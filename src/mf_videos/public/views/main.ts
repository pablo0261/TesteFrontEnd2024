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
    closeButton.innerHTML = '&times;'; 
    closeButton.classList.add('close-button');
    closeButton.onclick = () => document.body.removeChild(videoPlayer);

    videoPlayer.appendChild(closeButton);
    videoPlayer.appendChild(iframe);
    document.body.appendChild(videoPlayer); 
}

async function toggleFavorite(videoId: string, starElement: HTMLElement): Promise<void> {
    let favorites = getFavorites();
    const index = favorites.indexOf(videoId);
    const method = index !== -1 ? 'DELETE' : 'POST';

    try {
        const response = await fetch(`http://localhost:3002/api/favorites/${videoId}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            if (method === 'POST') {
                favorites.push(videoId);
                starElement.classList.remove('far');
                starElement.classList.add('fas');
            } else {
                favorites.splice(index, 1);
                starElement.classList.remove('fas');
                starElement.classList.add('far');
            }
            saveFavorites(favorites); // Guardar en localStorage
            updateFavoriteCounter(); // Actualizar contador de favoritos
            updateStarIcons(); // Actualizar iconos de estrella después de cambiar el estado
        } else {
            console.error('Error al agregar/eliminar favorito:', data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud al BFF:', error);
    }
}

function getFavorites(): string[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites: string[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteCounter(): void {
    const counterElement = document.getElementById('favorite-counter');
    const favorites = getFavorites();
    if (counterElement) {
        counterElement.textContent = favorites.length.toString();
    }
}

function updateStarIcons(): void {
    const favorites = getFavorites();
    const starElements = document.querySelectorAll('.favorite-star');

    starElements.forEach((starElement: Element) => {
        const videoId = (starElement as HTMLElement).dataset.videoId;
        if (videoId && favorites.includes(videoId)) {
            starElement.classList.remove('far');
            starElement.classList.add('fas');
        } else {
            starElement.classList.remove('fas');
            starElement.classList.add('far');
        }
    });
}

function fetchFavoritesAndDisplay(): void {
    const favorites = getFavorites();
    displayFavoriteVideos(favorites);
}

function displayFavoriteVideos(favorites: string[]): void {
    const favoriteList = document.getElementById('favoriteList');
    if (!favoriteList) return;

    favoriteList.innerHTML = '';
    favorites.forEach(videoId => {
        const favoriteItem = document.createElement('div');
        favoriteItem.textContent = `Favorite Video ID: ${videoId}`;
        favoriteList.appendChild(favoriteItem);
    });
}
