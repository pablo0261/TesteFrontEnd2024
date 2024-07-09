interface Video {
  id: string;
}

let favorites: Video[] = [];

export const toggleFavorite = async (videoId: string): Promise<Video[]> => {
  const existingIndex = favorites.findIndex(fav => fav.id === videoId);
  if (existingIndex === -1) {
    favorites.push({ id: videoId });
  }
  return favorites;
};

export const removeFavorite = async (videoId: string): Promise<Video[]> => {
  favorites = favorites.filter(fav => fav.id !== videoId);
  return favorites;
};
