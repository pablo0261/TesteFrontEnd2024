// src/utils/videoUtils.ts

export const toggleFavorite = async (videoId: string) => {
    try {
        const response = await fetch(`/api/favorites/${videoId}`, { method: 'POST' });
        const data = await response.json();
        return data.favorites; // Suponiendo que el servidor devuelve un array de favoritos actualizado
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw new Error('Failed to toggle favorite');
    }
};
