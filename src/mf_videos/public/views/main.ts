document.getElementById('searchForm')?.addEventListener('submit', async function(event: Event) {
    event.preventDefault();
    const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
    if (!query) return;
  
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  });
  
  function displayResults(data: any) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
  
    resultsContainer.innerHTML = ''; 
    data.items.forEach((item: any) => {
      const videoTitle = item.snippet.title;
      const videoId = item.id.videoId;
      const videoThumbnail = item.snippet.thumbnails.default.url;
  
      const videoElement = document.createElement('div');
      videoElement.innerHTML = `
        <h2>${videoTitle}</h2>
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${videoThumbnail}" alt="${videoTitle}">
        </a>
      `;
      resultsContainer.appendChild(videoElement);
    });
  }
  