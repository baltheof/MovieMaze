// Retrieve the list of favorite movies from localStorage (if any)
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Function to save a movie to favorites
function saveToFavorites(movieData) {
    // Check if movie is already in favorites
    if (!favoriteMovies.some(movie => movie.imdbID === movieData.imdbID)) {
        favoriteMovies.push(movieData); // Add movie to the array
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies)); // Store in localStorage
        alert(`${movieData.Title} has been added to your favorites!`);
    } else {
        alert(`${movieData.Title} is already in your favorites.`);
    }
}

// Function to remove a movie from favorites
function removeFromFavorites(imdbID) {
    // Remove the movie from the array
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies)); // Update localStorage
    displayFavorites(); // Re-render the list after removal
}

// Function to display the favorite movies in the favorites modal
function displayFavorites() {
    const favoritesList = document.getElementById('favoriteMoviesList');
    favoritesList.innerHTML = ''; // Clear the current list

    // Fetch the updated favorites list from localStorage
    let updatedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    // Remove the sample movie (e.g., imdbID 'tt1234567') from the list
    updatedFavorites = updatedFavorites.filter(movie => movie.imdbID !== 'tt1234567');

    // Store the updated list back to localStorage after filtering
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));

    if (updatedFavorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite movies yet!</p>';
    } else {
        updatedFavorites.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('favorite-movie-item');
            
            const movieTitle = document.createElement('span');
            movieTitle.textContent = movie.Title;
            movieItem.appendChild(movieTitle);

            const moviePoster = document.createElement('img');
            moviePoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'img/01-hor.jpg';  // fallback image
            moviePoster.alt = movie.Title;
            movieItem.appendChild(moviePoster);
            
            // Add the Remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-favorite-button');
            removeButton.addEventListener('click', () => {
                removeFromFavorites(movie.imdbID); // Remove movie when clicked
            });
            movieItem.appendChild(removeButton);

            favoritesList.appendChild(movieItem);
        });
    }
}

// Open the favorites modal
function openFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'block';
    displayFavorites();  // Show favorite movies from localStorage
}

// Close the favorites modal
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'none';
}

// Event listener for opening favorites modal
document.getElementById('openFavorites').addEventListener('click', openFavoritesModal);

// Event listener for closing favorites modal
document.getElementById('closeFavorites').addEventListener('click', closeFavoritesModal);

// Function to handle favorite button click in the search page
function handleFavoriteButtonClick(movieData) {
    saveToFavorites(movieData);
}

// Integrate this into the search page where you display movies
const favoriteButtons = document.querySelectorAll('.favorite-button');

// Add event listeners to each button
favoriteButtons.forEach(button => {
    button.addEventListener('click', function () {
        const movieId = button.getAttribute('data-movie-id'); // Get the movie ID
        const movieTitle = button.getAttribute('data-movie-title'); // Movie title
        const moviePoster = button.getAttribute('data-movie-poster'); // Movie poster URL

        // Store the movie data in localStorage (favorites list)
        const movieData = {
            Title: movieTitle,
            Poster: moviePoster,
            imdbID: movieId
        };

        // Save the movie to favorites
        handleFavoriteButtonClick(movieData);
    });
});
