const searchVideo = async () => {
    const query = (document.getElementById('searchQuery') as HTMLInputElement).value;
    if (!query) {
        alert('Please enter a search query');
        return;
    }

    try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        displaySearchResults(data.items);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
};

const displaySearchResults = (videos: any[]) => {
    const videoList = document.getElementById('videoList');
    if (videoList) {
        videoList.innerHTML = '';

        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.dataset.videoId = video.id.videoId;

            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favorite';
            favoriteButton.onclick = () => toggleFavorite(video.id.videoId);
            videoItem.appendChild(favoriteButton);

            const videoTitle = document.createElement('h3');
            videoTitle.textContent = video.snippet.title;
            videoItem.appendChild(videoTitle);

            const videoThumbnail = document.createElement('img');
            videoThumbnail.src = video.snippet.thumbnails.default.url;
            videoThumbnail.alt = video.snippet.title;
            videoItem.appendChild(videoThumbnail);

            videoList.appendChild(videoItem);
        });
    }
};

const toggleFavorite = async (videoId: string) => {
    try {
        const response = await fetch(`/api/favorites/${videoId}`, { method: 'POST' });
        const data = await response.json();
        alert(data.message);


        const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
        if (videoItem) {
            const favoriteButton = videoItem.querySelector('button');
            if (favoriteButton) {
                favoriteButton.textContent = '★ Favorited'; 
            }
        }

        const favoriteData = {
            videoId,
            action: 'add' 
        };
        window.parent.postMessage(favoriteData, '*'); 
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
};

const fetchFavoritesAndDisplay = async () => {
    try {
        const response = await fetch('/api/favorites');
        const data = await response.json();
        displayFavoriteVideos(data);
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
};

const displayFavoriteVideos = (favorites: string[]) => {
    const favoriteList = document.getElementById('favoriteList');
    if (favoriteList) {
        favoriteList.innerHTML = '';

        favorites.forEach(videoId => {
            const favoriteItem = document.createElement('div');
            favoriteItem.innerHTML = `
                <p>Favorite Video ID: ${videoId}</p>
            `;
            favoriteList.appendChild(favoriteItem);
        });
    }
};

if (document.getElementById('favoriteList')) {
    fetchFavoritesAndDisplay();
}
