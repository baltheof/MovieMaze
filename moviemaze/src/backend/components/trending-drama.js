// The OMDB API base URL and key
const apiKey = 'd7a86577';
const apiUrl = 'http://www.omdbapi.com/?apikey=' + apiKey;
const tmdbApiKey = 'a560cc8bb57e0028490ba9db344ad0c3';
const tmdbApiUrl = 'https://api.themoviedb.org/3';


// List of movie IDs to fetch for each section
const trendingMovieIDs = [
  'tt3896198', 'tt0369610', 'tt0848228', 'tt1856101', 'tt1821641',
  'tt0167404', 'tt1838556', 'tt0109830', 'tt0299871', 'tt0318853'
];

const dramaMovieIDs = [
  'tt0111161', 'tt0137523', 'tt0468569', 'tt1375666', 'tt6751668',
  'tt8579674', 'tt0231402', 'tt0499549', 'tt0108052', 'tt1074638',
  'tt0796366', 'tt1160419', 'tt0076759', 'tt0409459', 'tt0486576',
  'tt0457430', 'tt0114369', 'tt1951262', 'tt0816692', 'tt2322441'
];

const animationsMovieIDs = [
  'tt0114709', 'tt0848228', 'tt0499549', 'tt0336466', 'tt0126029',
  'tt1838556', 'tt0486655', 'tt0407362', 'tt1856101', 'tt1951262',
  'tt3691740', 'tt1034415', 'tt1679335', 'tt1758692', 'tt1727776',
  'tt0444682', 'tt1375666', 'tt1895353', 'tt0468569'
];

const fanFictionMovieIDs = [
  'tt0304141', 'tt0121765', 'tt1606375', 'tt1124596', 'tt0796366',
  'tt3748528', 'tt1856101', 'tt0110912', 'tt0345950', 'tt0242519',
  'tt0080684', 'tt0271486', 'tt1623205', 'tt1855983', 'tt0136273',
  'tt2179136', 'tt0438097', 'tt0816692', 'tt0783233'
];

// Function to create a movie item HTML element dynamically
function createMovieItem(movieData) {
  const movieItem = document.createElement('div');
  movieItem.classList.add('movie-list-item');
  
  // Create image container for hover effect
  const imgContainer = document.createElement('div');
  imgContainer.classList.add('img-container');
  
  // Create image element
  const imgElement = document.createElement('img');
  imgElement.classList.add('movie-list-item-img');
  imgElement.src = movieData.Poster !== 'N/A' ? movieData.Poster : 'img/01-hor.jpg'; // fallback to default image
  imgElement.alt = movieData.Title;
  
  // Create title element
  const titleElement = document.createElement('span');
  titleElement.classList.add('movie-list-item-title');
  titleElement.textContent = movieData.Title;

  // Get the runtime in minutes and convert to hours and minutes
  const runtime = movieData.Runtime;
  const runtimeMinutes = parseInt(runtime.split(' ')[0]); // Extract numeric value from the "XX min" format
  const hours = Math.floor(runtimeMinutes / 60); // Calculate hours
  const minutes = runtimeMinutes % 60; // Calculate remaining minutes
  const runtimeText = `${hours}h ${minutes}m`; // Format runtime as "Xh Ym"
  
  // Create runtime element
  const runtimeElement = document.createElement('span');
  runtimeElement.classList.add('movie-list-item-runtime');
  runtimeElement.textContent = runtimeText;

  // Create Watch button element
  const buttonElement = document.createElement('button');
  buttonElement.classList.add('movie-list-item-button');
  buttonElement.textContent = 'Watch';
  buttonElement.onclick = () => openModal(movieData);
  
  // Append title, runtime, and Watch button to the image container (for hover effect)
  imgContainer.appendChild(imgElement);
  imgContainer.appendChild(titleElement);
  imgContainer.appendChild(runtimeElement);
  imgContainer.appendChild(buttonElement);  // Add the Watch button inside the image container
  
  // Append the image container to the movie item
  movieItem.appendChild(imgContainer);

  return movieItem;
}

// Function to open the movie modal
async function openModal(movieData) {
  const modal = document.getElementById('movieModal');
  const modalImage = document.getElementById('modalImage');
  const modalVideoContainer = document.getElementById('modalVideoContainer');
  const movieYear = document.getElementById('movieYear');
  const movieGenre = document.getElementById('movieGenre');
  const movieDirector = document.getElementById('movieDirector');
  const ratingValue = document.getElementById('ratingValue');

  // Set the movie image
  modalImage.src = movieData.Poster;

  // Set movie details
  movieYear.textContent = `Year: ${movieData.Year}`;
  movieGenre.textContent = `Genre: ${movieData.Genre}`;
  movieDirector.textContent = `Director: ${movieData.Director}`;

  // Set the movie rating
  ratingValue.textContent = movieData.imdbRating || 'N/A'; // Display 'N/A' if no rating available

  // Fetch the trailer using the TMDb API
  const tmdbSearchUrl = `${tmdbApiUrl}/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieData.Title)}&year=${movieData.Year}`;
  try {
    const searchResponse = await fetch(tmdbSearchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const movieId = searchData.results[0].id; // Get the first matching movie ID
      const trailerUrl = `${tmdbApiUrl}/movie/${movieId}/videos?api_key=${tmdbApiKey}`;
      const trailerResponse = await fetch(trailerUrl);
      const trailerData = await trailerResponse.json();

      // Find the YouTube trailer
      const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        const videoElement = document.createElement('iframe');
        videoElement.src = `https://www.youtube.com/embed/${trailer.key}`;
        videoElement.width = "100%";
        videoElement.height = "315";
        videoElement.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        videoElement.allowFullscreen = true;

        // Clear previous video and append the new one
        modalVideoContainer.innerHTML = ''; // Clear previous content
        modalVideoContainer.appendChild(videoElement);
      } else {
        modalVideoContainer.innerHTML = '<p>No trailer available.</p>';
      }
    } else {
      modalVideoContainer.innerHTML = '<p>No movie found in TMDb database.</p>';
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
    modalVideoContainer.innerHTML = '<p>Error loading trailer.</p>';
  }

      // Favorite button click event
      favoriteButton.onclick = function() {
        handleFavoriteButtonClick(movieData);  // Add the movie to favorites
        favoriteButton.classList.toggle('active');  // Toggle the active button style
        favoriteButton.textContent = favoriteButton.classList.contains('active') ? 'Added to Favorites' : 'Add to Favorites';
    };

  // Display the modal
  modal.style.display = "block";

  // Close the modal when the user clicks on <span> (x)
  const closeModal = document.getElementsByClassName("close")[0];
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal if the user clicks anywhere outside of the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Function to fetch and display movies dynamically
async function fetchAndDisplayMovies(movieIDs, sectionID) {
  const movieList = document.querySelector(`#${sectionID} .movie-list`);
  
  // Clear the movie list before adding new items (to avoid duplicates)
  movieList.innerHTML = '';
  
  // Loop through each movie ID and fetch data
  for (let i = 0; i < movieIDs.length; i++) {
    const movieID = movieIDs[i];
    const response = await fetch(apiUrl + '&i=' + movieID);
    const data = await response.json();

    console.log(data); // Log the response to see if it's returning correctly
    
    if (data.Response === 'True') {
      const movieItem = createMovieItem(data);
      movieList.appendChild(movieItem);
    } else {
      console.log(`Movie with ID ${movieID} not found or erroACr: ${data.Error}`);
    }
  }

  // Call the sliding functionality after movies are loaded
  setTimeout(() => {
    setupArrowSliding(sectionID);
  }, 500); // Add delay to ensure movies are appended before the sliding logic runs
}

// Arrow sliding functionality
function setupArrowSliding(sectionID) {
  const arrow = document.querySelector(`#${sectionID} .arrow`);
  const movieList = document.querySelector(`#${sectionID} .movie-list`);
  const itemsToShow = 4; // Number of items you want to show at a time
  let clickCounter = 0;

  // Wait until the movie list has been filled before calculating the item width
  const itemWidth = movieList.querySelector('.movie-list-item')?.offsetWidth; // Get width of one item

  // Check if the itemWidth is correctly calculated
  if (!itemWidth) {
    console.log('Item width not calculated correctly.');
    return; // Exit if we don't have a valid item width
  }

  const itemNumber = movieList.querySelectorAll('.movie-list-item').length;
  const maxTranslate = (itemNumber - itemsToShow) * itemWidth; // Maximum translation limit
  
  // Adjust for cases when fewer items are available than itemsToShow
  if (itemNumber <= itemsToShow) {
    arrow.style.display = 'none'; // Hide arrows if there are not enough items to scroll
  } else {
    arrow.style.display = 'block'; // Show arrows if there are enough items to scroll
  }

  arrow.addEventListener('click', () => {
    clickCounter++;
    
    // Check if we have more items to slide
    if (clickCounter * itemWidth <= maxTranslate) {
      movieList.style.transform = `translateX(-${clickCounter * itemWidth}px)`;
    } else {
      // Reset to the beginning if we've reached the end
      movieList.style.transform = 'translateX(0)';
      clickCounter = 0;
    }
  });
}

// Call the function once the page has loaded
window.onload = () => {
  fetchAndDisplayMovies(trendingMovieIDs, 'Trending');
  fetchAndDisplayMovies(dramaMovieIDs, 'Drama');
  
  // Fetch and display movies for ANIMATIONS section
  fetchAndDisplayMovies(animationsMovieIDs, 'ANIMATIONS');
  
  // Fetch and display movies for FAN-FICTION section
  fetchAndDisplayMovies(fanFictionMovieIDs, 'FANFICTION');
};
