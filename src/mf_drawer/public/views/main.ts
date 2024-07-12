import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const favoritesFromServer = await fetchFavoritesFromServer();
  saveFavorites(favoritesFromServer);
  updateStarIcons(); // Asegura que los íconos de estrella se actualicen al cargar la página

  document.getElementById('favoritesButton')?.addEventListener('click', async () => {
    const favoriteIds = await fetchFavoritesFromServer();
    const favoriteVideos = await fetchVideosFromYouTube(favoriteIds);
    renderFavoriteVideos(favoriteVideos);
  });
});

document.getElementById('searchForm')?.addEventListener('submit', async function(event) {
  event.preventDefault();
  const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
  if (!query) return;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data: Video[] = await response.json();
    displaySearchResults(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
});

async function displaySearchResults(videos: Video[]) {
  const resultsContainer = document.getElementById('videos-container');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '';
  for (const video of videos) {
    const videoItem = createVideoItem(video, false);
    resultsContainer.appendChild(videoItem);
  }

  updateStarIcons();
}

async function fetchVideosFromYouTube(videoIds: string[]): Promise<Video[]> {
  const videos: Video[] = [];

  for (const videoId of videoIds) {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`);
      const data = await response.json();
      const video: Video = {
        id: { videoId },
        snippet: {
          title: data.items[0].snippet.title,
          thumbnails: {
            default: {
              url: data.items[0].snippet.thumbnails.default.url,
            },
          },
        },
      };
      videos.push(video);
    } catch (error) {
      console.error(`Error fetching video ${videoId} from YouTube:`, error);
    }
  }

  return videos;
}

function renderFavoriteVideos(videos: Video[]): void {
  const videosContainer = document.getElementById('videos-container');
  const favoritesContainer = document.getElementById('favorites-container');
  if (!videosContainer || !favoritesContainer) return;

  videosContainer.style.display = 'none';
  favoritesContainer.style.display = 'grid';
  favoritesContainer.innerHTML = '';

  videos.forEach(video => {
    const videoItem = createVideoItem(video, true);
    favoritesContainer.appendChild(videoItem);
  });

  updateStarIcons();
}

function createVideoItem(video: Video, isFavorite: boolean): HTMLElement {
  const videoItem = document.createElement('div');
  videoItem.classList.add('video-item');
  videoItem.dataset.videoId = video.id.videoId;

  const favoriteStar = document.createElement('i');
  favoriteStar.classList.add('favorite-star', 'far', 'fa-star');
  if (isFavorite) {
    favoriteStar.classList.remove('far');
    favoriteStar.classList.add('fas');
    favoriteStar.style.color = 'yellow';
  }
  favoriteStar.onclick = () => toggleFavorite(video.id.videoId, favoriteStar);
  videoItem.appendChild(favoriteStar);

  const videoThumbnail = document.createElement('img');
  videoThumbnail.src = video.snippet.thumbnails.default.url;
  videoThumbnail.alt = video.snippet.title;
  videoThumbnail.onclick = () => playVideo(video.id.videoId, videoItem);
  videoItem.appendChild(videoThumbnail);

  return videoItem;
}

async function toggleFavorite(videoId: string, starElement: HTMLElement): Promise<void> {
  const url = `http://localhost:3000/api/favorites/${videoId}`;
  const isFavorite = starElement.classList.contains('fas');

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
        starElement.classList.remove('fas');
        starElement.classList.add('far');
        starElement.style.color = '';
      } else {
        starElement.classList.remove('far');
        starElement.classList.add('fas');
        starElement.style.color = 'yellow';
      }
      updateFavoriteCounter(); // Actualiza el contador de favoritos después de cada cambio
      updateStarIcons(); // Actualiza todos los íconos de estrella basados en el estado actual de favoritos
    } else {
      console.error('Error adding/removing favorite:', await response.json());
    }
  } catch (error) {
    console.error('Error in BFF request:', error);
  }
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
    const data: { id: string }[] = await response.json();
    return data.map(video => video.id);
  } catch (error) {
    console.error('Error fetching favorites from server:', error);
    return [];
  }
}

function updateStarIcons(): void {
  const favorites = getFavorites();
  const starElements = document.querySelectorAll('.favorite-star');

  starElements.forEach(starElement => {
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

function playVideo(videoId: string, videoItem: HTMLElement): void {
  const videoPlayer = document.getElementById('videoPlayer');
  if (videoPlayer) {
    const iframe = videoPlayer.querySelector('iframe');
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
    }
    videoPlayer.style.display = 'block';
  }

  const previouslySelected = document.querySelector('.selected-video');
  if (previouslySelected) {
    previouslySelected.classList.remove('selected-video');
  }
  videoItem.classList.add('selected-video');
}

// Local storage functions to fetch and save favorites temporarily
function getFavorites(): string[] {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites: string[]): void {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
