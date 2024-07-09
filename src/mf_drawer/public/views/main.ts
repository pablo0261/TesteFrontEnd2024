import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    isFavorite: boolean;
}

const videosButton = document.getElementById('videosButton') as HTMLButtonElement;
const favoritesButton = document.getElementById('favoritesButton') as HTMLButtonElement;
const favoritesCount = document.getElementById('favoritesCount') as HTMLSpanElement;
const videoListContainer = document.getElementById('videoListContainer') as HTMLDivElement;

let videos: Video[] = [];
let favorites: Video[] = [];

async function searchVideos(query: string): Promise<void> {
    try {
        const response = await fetch(`https://api.youtube.com/search?q=${query}&key=${API_KEY}`);
        const data = await response.json();

        videos = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            isFavorite: favorites.some(fav => fav.id === item.id.videoId)
        }));

        renderVideos();
    } catch (error) {
        console.error('Error al buscar videos:', error);
    }
}

function renderVideos(): void {
    videoListContainer.innerHTML = '';

    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <h3>${video.title}</h3>
            <button class="favorite-button">${video.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</button>
        `;

        const favoriteButton = videoItem.querySelector('.favorite-button') as HTMLButtonElement;
        favoriteButton.addEventListener('click', () => toggleFavorite(video));

        videoListContainer.appendChild(videoItem);
    });
}

function toggleFavorite(video: Video): void {
    const index = favorites.findIndex(fav => fav.id === video.id);

    if (index === -1) {
        favorites.push(video);
        video.isFavorite = true;
    } else {
        favorites.splice(index, 1);
        video.isFavorite = false;
    }

    favoritesCount.textContent = favorites.length.toString();

    renderVideos();

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

document.addEventListener('DOMContentLoaded', () => {
    videosButton.addEventListener('click', () => {
        console.log('Mostrar lista de vídeos');
        videoListContainer.innerHTML = '';
        searchVideos('');
    });

    favoritesButton.addEventListener('click', () => {
        console.log('Mostrar lista de favoritos');
        videoListContainer.innerHTML = '';
        videos = favorites;
        renderVideos();
    });

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
        favoritesCount.textContent = favorites.length.toString();
    }
});
