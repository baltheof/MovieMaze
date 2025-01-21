// // The OMDB API base URL and key
// const apiKey = 'd7a86577';
// const apiUrl = 'http://www.omdbapi.com/?apikey=' + apiKey;

// // List of movie IDs to fetch (these are placeholders, you can add more)
// const movieIDs = [
//   'tt3896198', 'tt0369610', 'tt0848228', 'tt1856101', 'tt1821641', 
//   'tt0167404', 'tt1838556', 'tt0109830', 'tt0299871', 'tt0318853'
// ];

// // Function to create a movie item HTML element dynamically
// function createMovieItem(movieData) {
//   const movieItem = document.createElement('div');
//   movieItem.classList.add('movie-list-item');
  
//   // Create image element
//   const imgElement = document.createElement('img');
//   imgElement.classList.add('movie-list-item-img');
//   imgElement.src = movieData.Poster !== 'N/A' ? movieData.Poster : 'img/01-hor.jpg'; // fallback to default image
//   imgElement.alt = movieData.Title;
  
//   // Create title element
//   const titleElement = document.createElement('span');
//   titleElement.classList.add('movie-list-item-title');
//   titleElement.textContent = movieData.Title;
  
//   // Create description element
//   const descElement = document.createElement('p');
//   descElement.classList.add('movie-list-item-desc');
//   descElement.textContent = movieData.Plot || 'No description available';
  
//   // Create button element
//   const buttonElement = document.createElement('button');
//   buttonElement.classList.add('movie-list-item-button');
//   buttonElement.textContent = 'Watch';
//   buttonElement.onclick = () => window.open('https://www.imdb.com/title/' + movieData.imdbID, '_blank');
  
//   // Append all elements to the movie item
//   movieItem.appendChild(imgElement);
//   movieItem.appendChild(titleElement);
//   movieItem.appendChild(descElement);
//   movieItem.appendChild(buttonElement);

//   return movieItem;
// }

// // Function to fetch movie data and update the HTML
// async function fetchAndDisplayMovies() {
//   const movieList = document.querySelector('.movie-list');
  
//   // Loop through each movie ID and fetch data
//   for (let i = 0; i < movieIDs.length; i++) {
//     const movieID = movieIDs[i];
//     const response = await fetch(apiUrl + '&i=' + movieID);
//     const data = await response.json();

//     if (data.Response === 'True') {
//       const movieItem = createMovieItem(data);
//       movieList.appendChild(movieItem);
//     }
//   }
// }

// // Call the function once the page has loaded
// window.onload = fetchAndDisplayMovies;
