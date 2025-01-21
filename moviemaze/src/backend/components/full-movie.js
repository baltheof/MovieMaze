// Full Movie Playback Script

// API Base URL (Replace with your movie streaming API base URL)
const API_BASE_URL = 'https://api.example.com/movies';

// Select modal and modal container elements
const modal = document.getElementById('movieModal');
const modalVideoContainer = document.getElementById('modalVideoContainer');

// Function to fetch the full movie URL based on IMDb ID
async function fetchFullMovieUrl(imdbID) {
  try {
    // Call the API to get the movie's streaming URL
    const response = await fetch(`${API_BASE_URL}/${imdbID}/stream`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // Replace YOUR_API_KEY with your actual API key
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the movie URL.');
    }

    const data = await response.json();

    // Return the full movie URL
    return data.movieUrl; // Ensure the API returns { movieUrl: 'https://...' }
  } catch (error) {
    console.error('Error fetching the movie URL:', error);
    return null;
  }
}

// Function to embed the full movie in the modal
async function embedMovieInModal(imdbID) {
  // Clear any previous video content
  modalVideoContainer.innerHTML = '';

  // Fetch the full movie URL
  const movieUrl = await fetchFullMovieUrl(imdbID);

  if (movieUrl) {
    // Create an iframe to embed the movie
    const iframe = document.createElement('iframe');
    iframe.src = movieUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allowFullscreen = true;
    iframe.frameBorder = '0';

    // Append the iframe to the modal's video container
    modalVideoContainer.appendChild(iframe);
  } else {
    // Show an error message if the movie URL could not be fetched
    modalVideoContainer.innerHTML = '<p style="color: red;">Failed to load the movie. Please try again later.</p>';
  }
}

// Event listener for the "Watch" button
// Assumes you have dynamically created "Watch" buttons with a data-imdbid attribute
const watchButtons = document.querySelectorAll('.watch-button');

watchButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const imdbID = event.target.getAttribute('data-imdbid');

    if (imdbID) {
      // Open the modal
      modal.style.display = 'block';

      // Embed the movie in the modal
      embedMovieInModal(imdbID);
    }
  });
});

// Event listener to close the modal
const closeModalButton = document.querySelector('.close-modal');
closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';

  // Clear the modal content when closing
  modalVideoContainer.innerHTML = '';
});

// Optional: Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    modalVideoContainer.innerHTML = '';
  }
});
