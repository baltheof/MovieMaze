const form = document.querySelector('form');
const gallery = document.querySelector('.image-container');
const apiKey = 'd7a86577'; // Replace with your actual OMDB API Key
const tmdbApiKey = 'a560cc8bb57e0028490ba9db344ad0c3'; // TMDB API Key
const modal = document.getElementById("movieModal");
const modalImage = document.getElementById("modalImage");
const modalYear = document.getElementById("movieYear");
const modalGenre = document.getElementById("movieGenre");
const modalDirector = document.getElementById("movieDirector");
const modalRating = document.getElementById("ratingValue");
const trailerIframe = document.createElement("iframe"); // Dynamically create iframe
const closeModal = document.querySelector(".close");
const favoriteButton = document.getElementById("favoriteButton"); // The "Add to Favorites" button


let currentPage = 1;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let query = form.querySelector('input').value;
    form.querySelector('input').value = '';

    if (query === '') {
        query = "nothing";
    }
    currentPage = 1; // Reset to first page when submitting a new query
    omdbApi(query);
});

async function omdbApi(query) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&page=${currentPage}&apikey=${apiKey}`);
        const data = await res.json();

        if (data.Response === "True") {
            makeImages(data.Search); // Display movie posters
        } else {
            gallery.innerHTML = '<p>No movies found. Please try another search.</p>';
        }
    } catch (error) {
        console.error('Error fetching data from OMDb API:', error);
        gallery.innerHTML = '<p>An error occurred. Please try again later.</p>';
    }
}

function makeImages(shows) {
    gallery.innerHTML = ''; // Clear any previous images

    shows.forEach(show => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const imgElement = document.createElement('img');
        imgElement.src = show.Poster !== "N/A" ? show.Poster : "img/placeholder.jpg";
        imgElement.alt = show.Title;

        const titleElement = document.createElement('span');
        titleElement.textContent = show.Title;

        const modalButton = document.createElement('button');
        modalButton.textContent = 'View Details';
        modalButton.classList.add('modal-button');

        modalButton.addEventListener('click', () => {
            openModal(show.imdbID, show.Title);
        });

        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(titleElement);
        imageWrapper.appendChild(modalButton);

        gallery.appendChild(imageWrapper);
    });
}

async function openModal(movieId, title) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
        const data = await res.json();

        if (data.Response === "True") {
            // Update modal content with movie details
            modalImage.src = data.Poster !== "N/A" ? data.Poster : "img/placeholder.jpg";
            modalYear.textContent = `Year: ${data.Year}`;
            modalGenre.textContent = `Genre: ${data.Genre}`;
            modalDirector.textContent = `Director: ${data.Director}`;
            modalRating.textContent = data.imdbRating !== "N/A" ? `Rating: ${data.imdbRating}` : "Rating: Not Rated";

            const trailerUrl = await fetchMovieTrailer(title);
            if (trailerUrl) {
                trailerIframe.src = trailerUrl;
                trailerIframe.width = "560";
                trailerIframe.height = "315";
                trailerIframe.frameBorder = "0";
                trailerIframe.allowFullscreen = true;
                document.getElementById('modalVideoContainer').appendChild(trailerIframe);
            } else {
                document.getElementById('modalVideoContainer').innerHTML = '<p>No trailer available.</p>';
            }

                // Display the "Add to Favorites" button in the modal
            favoriteButton.setAttribute('data-movie-id', movieId);
            favoriteButton.setAttribute('data-movie-title', data.Title);
            favoriteButton.setAttribute('data-movie-poster', data.Poster);
            favoriteButton.style.display = 'inline-block';

            modal.style.display = "block";
        } else {
            alert("Movie details could not be fetched.");
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert("An error occurred. Please try again later.");
    }
}

async function fetchMovieTrailer(title) {
    try {
        const tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${tmdbApiKey}`;
        const searchResponse = await fetch(tmdbSearchUrl);
        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const movieId = searchData.results[0].id;
            const tmdbTrailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}`;
            const trailerResponse = await fetch(tmdbTrailerUrl);
            const trailerData = await trailerResponse.json();

            const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                return `https://www.youtube.com/embed/${trailer.key}`; // Embed YouTube trailer URL
            }
        }
    } catch (error) {
        console.error('Error fetching movie trailer from TMDB:', error);
    }
    return null;
}

// Event listener to close the modal when clicking the close button
closeModal.onclick = function () {
    modal.style.display = "none";
    trailerIframe.src = ""; // Clear the trailer iframe
    favoriteButton.style.display = 'none'; // Hide the "Add to Favorites" button
  };

closeModal.onclick = function () {
    modal.style.display = "none";
    trailerIframe.src = ""; // Clear the trailer iframe
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
        trailerIframe.src = ""; // Clear the trailer iframe
    }
};

// Event listener for "Add to Favorites" button
favoriteButton.addEventListener('click', function () {
  const movieData = {
    Title: favoriteButton.getAttribute('data-movie-title'),
    Poster: favoriteButton.getAttribute('data-movie-poster'),
    imdbID: favoriteButton.getAttribute('data-movie-id')
  };

  // Call the function to save movie to favorites
  saveToFavorites(movieData);
});