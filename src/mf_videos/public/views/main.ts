document.getElementById('searchForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
    if (!query) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySearchResults(data); 
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


    updateStarIcons(); 
}

function playVideo(videoId: string, container: HTMLElement) {
    const videoPlayer = document.createElement('div');
    videoPlayer.classList.add('video-player');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
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
    const favorites = getFavorites();
    const isFavorite = favorites.includes(videoId);

    const url = `http://localhost:3000/api/favorites/${videoId}`;

    console.log(`Enviando solicitud a: ${url}`);

    try {
        const response = await fetch(url, {
            method: isFavorite ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if (response.ok) {
            if (isFavorite) {
                const index = favorites.indexOf(videoId);
                if (index !== -1) {
                    favorites.splice(index, 1);
                }
                starElement.classList.remove('fas');
                starElement.classList.add('far');
                starElement.style.color = '';
            } else {
                favorites.push(videoId);
                starElement.classList.remove('far');
                starElement.classList.add('fas');
                starElement.style.color = 'yellow';
            }
            saveFavorites(favorites); // Save favorites to localStorage
            updateFavoriteCounter(); // Update favorite counter
        } else {
            console.error('Error adding/removing favorite:', await response.json());
        }
    } catch (error) {
        console.error('Error in BFF request:', error);
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

async function fetchFavoritesFromServer(): Promise<string[]> {
    try {
        const response = await fetch('http://localhost:3000/api/favorites');
        const data = await response.json();
        return data.map((video: { id: string }) => video.id);
    } catch (error) {
        console.error('Error fetching favorites from server:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const favoritesFromServer = await fetchFavoritesFromServer();
    saveFavorites(favoritesFromServer); // Save favorites from server to localStorage
    updateStarIcons(); // Update star icons based on fetched favorites
});

function updateStarIcons(): void {
    const favorites = getFavorites();
    const starElements = document.querySelectorAll('.favorite-star');

    starElements.forEach((starElement: Element) => {
        const videoId = (starElement as HTMLElement).parentElement?.dataset.videoId;
        if (videoId && favorites.includes(videoId)) {
            starElement.classList.remove('far');
            starElement.classList.add('fas');
            (starElement as HTMLElement).style.color = 'yellow';
        } else {
            starElement.classList.remove('fas');
            starElement.classList.add('far');
            (starElement as HTMLElement).style.color = '';
        }
    });
}
